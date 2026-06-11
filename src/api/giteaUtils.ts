interface GiteaActivity {
	id: number;
	op_type: string;
	created: string;
	act_user?: {
		login?: string;
		username?: string;
	};
}

interface ContributionDay {
	color: string;
	contributionCount: number;
	date: string;
	weekday: number;
}

interface ContributionWeek {
	firstDay: string;
	contributionDays: ContributionDay[];
}

interface ContributionCalendar {
	colors: string[];
	totalContributions: number;
	weeks: ContributionWeek[];
}

const contributionColors = [
	"#ebedf0",
	"#9be9a8",
	"#40c463",
	"#30a14e",
	"#216e39",
];

const toDate = (date: Date) => date.toISOString().slice(0, 10);

const getWeekday = (date: Date) => {
	const day = date.getUTCDay();
	return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Sunday=6
};

export const convertGiteaActivitiesToCalendar = (
	activities: GiteaActivity[],
	year: number,
): ContributionCalendar => {
	// Count contributions by date
	const contributionsByDate = new Map<string, number>();

	for (const activity of activities) {
		try {
			const activityDate = new Date(activity.created);
			const activityYear = activityDate.getUTCFullYear();

			// Only process activities for the requested year
			if (activityYear !== year) {
				continue;
			}

			const dateStr = toDate(activityDate);
			const count = contributionsByDate.get(dateStr) || 0;
			contributionsByDate.set(dateStr, count + 1);
		} catch (_error) {
			console.warn("Invalid date in activity:", activity.created);
		}
	}

	// Build weeks starting from January 1st
	const firstDay = new Date(Date.UTC(year, 0, 1));
	const lastDay = new Date(Date.UTC(year, 11, 31));

	// Find the start of the first week (Sunday before or on Jan 1)
	const firstWeekStart = new Date(firstDay);
	const firstWeekday = firstDay.getUTCDay();
	firstWeekStart.setUTCDate(firstDay.getUTCDate() - firstWeekday);

	// Build weeks
	const weeks: ContributionWeek[] = [];
	const currentDate = new Date(firstWeekStart);

	while (currentDate <= lastDay) {
		const weekStart = new Date(currentDate);
		const contributionDays: ContributionDay[] = [];

		for (let i = 0; i < 7; i++) {
			const dayDate = new Date(weekStart);
			dayDate.setUTCDate(weekStart.getUTCDate() + i);

			const dateStr = toDate(dayDate);
			const contributionCount = contributionsByDate.get(dateStr) || 0;

			// Determine color level (0-4)
			let colorLevel = 0;
			if (contributionCount > 0) {
				if (contributionCount >= 10) colorLevel = 4;
				else if (contributionCount >= 6) colorLevel = 3;
				else if (contributionCount >= 3) colorLevel = 2;
				else colorLevel = 1;
			}

			contributionDays.push({
				color: contributionColors[colorLevel],
				contributionCount,
				date: dateStr,
				weekday: getWeekday(dayDate),
			});
		}

		weeks.push({
			firstDay: toDate(weekStart),
			contributionDays,
		});

		currentDate.setUTCDate(currentDate.getUTCDate() + 7);
	}

	// Calculate total contributions
	const totalContributions = Array.from(contributionsByDate.values()).reduce(
		(sum, count) => sum + count,
		0,
	);

	return {
		colors: contributionColors,
		totalContributions,
		weeks,
	};
};

export const getLoginFromGiteaActivities = (
	payload: unknown,
): string | null => {
	if (!Array.isArray(payload)) {
		console.warn("getLoginFromGiteaActivities: payload não é um array");
		return null;
	}

	console.log("Procurando login em", payload.length, "atividades");

	const firstActivity = payload.find(
		(activity): activity is GiteaActivity =>
			typeof activity === "object" &&
			activity !== null &&
			"act_user" in activity,
	);

	if (!firstActivity) {
		console.warn("Nenhuma atividade com act_user encontrada");
		return null;
	}

	console.log("Primeira atividade com act_user:", {
		login: firstActivity.act_user?.login,
		username: firstActivity.act_user?.username,
	});

	return (
		firstActivity?.act_user?.login ?? firstActivity?.act_user?.username ?? null
	);
};

export const processGiteaActivitiesIntoCalendars = (
	activities: GiteaActivity[],
): Record<number, ContributionCalendar> => {
	// Find all unique years in the activities
	const years = new Set<number>();

	for (const activity of activities) {
		try {
			const activityDate = new Date(activity.created);
			const year = activityDate.getUTCFullYear();
			if (year >= 2000 && year <= 2100) {
				// Sanity check
				years.add(year);
			}
		} catch (_error) {
			console.warn("Invalid date in activity:", activity.created);
		}
	}

	console.log("Anos encontrados nas atividades:", Array.from(years).sort());

	// Build calendar for each year
	const calendars: Record<number, ContributionCalendar> = {};

	for (const year of years) {
		calendars[year] = convertGiteaActivitiesToCalendar(activities, year);
		console.log(
			`Calendário ${year}: ${calendars[year].totalContributions} contribuições`,
		);
	}

	return calendars;
};
