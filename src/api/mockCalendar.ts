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

export interface ContributionCalendar {
	colors: string[];
	totalContributions: number;
	weeks: ContributionWeek[];
}

export const mockProfile = {
	name: "Marcio Adilio Voikolesco Junior",
	login: "marcioj",
	avatarUrl:
		"https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
};

const contributionColors = [
	"#ebedf0",
	"#9be9a8",
	"#40c463",
	"#30a14e",
	"#216e39",
];

const MAX_MOCK_CONTRIBUTIONS_PER_DAY = 75;

const sourceDailyCounts: [string, number][] = [
	["01-16", 13],
	["01-19", 27],
	["01-20", 17],
	["01-21", 9],
	["01-22", 4],
	["01-23", 1],
	["01-26", 12],
	["01-27", 1],
	["01-28", 6],
	["01-29", 57],
	["01-30", 10],
	["02-02", 4],
	["02-03", 5],
	["02-04", 33],
	["02-05", 25],
	["02-06", 8],
	["02-09", 32],
	["02-10", 13],
	["02-11", 34],
	["02-12", 25],
	["02-13", 16],
	["02-16", 40],
	["02-17", 34],
	["02-18", 36],
	["02-19", 18],
	["02-20", 17],
	["02-23", 53],
	["02-24", 16],
	["02-25", 19],
	["02-26", 24],
	["02-27", 27],
	["03-02", 65],
	["03-03", 45],
	["03-04", 32],
	["03-05", 23],
	["03-06", 19],
	["03-09", 36],
	["03-10", 30],
	["03-11", 21],
	["03-12", 19],
	["03-13", 38],
	["03-16", 9],
	["03-17", 53],
	["03-18", 42],
	["03-19", 44],
	["03-20", 48],
	["03-23", 15],
	["03-24", 16],
	["03-25", 11],
	["03-26", 35],
	["03-27", 12],
	["03-30", 92],
	["03-31", 57],
	["04-01", 41],
	["04-02", 22],
	["04-06", 40],
	["04-07", 23],
	["04-08", 40],
	["04-09", 24],
	["04-13", 40],
	["04-14", 40],
	["04-15", 27],
	["04-16", 43],
	["04-17", 80],
	["04-22", 22],
	["04-23", 44],
	["04-24", 10],
	["04-27", 29],
	["04-28", 52],
	["04-29", 51],
	["04-30", 41],
	["05-04", 48],
	["05-05", 28],
	["05-06", 6],
	["05-07", 31],
	["05-08", 24],
	["05-11", 37],
	["05-14", 60],
	["05-15", 22],
	["05-18", 30],
	["05-20", 25],
	["05-21", 83],
	["05-22", 8],
	["05-25", 35],
	["05-26", 25],
	["05-27", 20],
	["05-28", 22],
	["05-29", 21],
	["06-01", 23],
	["06-02", 6],
	["06-03", 34],
	["06-08", 27],
	["06-09", 12],
	["06-10", 56],
];

const sourceCountsByMonthDay = new Map(sourceDailyCounts);
const sourceCounts = sourceDailyCounts.map(([, count]) => count);

const createPageLoadSeed = () => {
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
		const values = new Uint32Array(1);
		crypto.getRandomValues(values);
		return values[0];
	}

	return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const pageLoadSeed = createPageLoadSeed();

const toDate = (date: Date) => date.toISOString().slice(0, 10);

const monthDay = (date: Date) => toDate(date).slice(5);

const getDayOfYear = (date: Date) => {
	const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
	return Math.floor((date.getTime() - yearStart) / 86_400_000);
};

const seededNoise = (year: number, dayOfYear: number, channel = 0) => {
	const value =
		Math.sin(
			pageLoadSeed * 0.000_001 +
				year * 12.9898 +
				dayOfYear * 78.233 +
				channel * 37.719,
		) * 43_758.5453;
	return value - Math.floor(value);
};

const getColor = (count: number) => {
	if (count >= 45) return contributionColors[4];
	if (count >= 25) return contributionColors[3];
	if (count >= 10) return contributionColors[2];
	if (count > 0) return contributionColors[1];
	return contributionColors[0];
};

const clampMockCount = (count: number) =>
	Math.max(0, Math.min(MAX_MOCK_CONTRIBUTIONS_PER_DAY, Math.round(count)));

const getMockContributionCount = (date: Date, year: number) => {
	const directCount = sourceCountsByMonthDay.get(monthDay(date));
	const weekday = date.getUTCDay();
	const dayOfYear = getDayOfYear(date);
	const noise = seededNoise(year, dayOfYear);

	if (weekday === 0 || weekday === 6) {
		return noise > 0.94
			? clampMockCount(1 + seededNoise(year, dayOfYear, 1) * 8)
			: 0;
	}

	const activeChance =
		0.56 +
		0.08 * Math.sin((dayOfYear / 365) * Math.PI * 3) +
		(directCount !== undefined ? 0.08 : 0);

	if (noise > activeChance) {
		return 0;
	}

	const sourceIndex =
		(dayOfYear * 7 + year + Math.floor(pageLoadSeed % sourceCounts.length)) %
		sourceCounts.length;
	const baseCount = directCount ?? sourceCounts[sourceIndex];
	const sourceWeight =
		Math.min(baseCount, MAX_MOCK_CONTRIBUTIONS_PER_DAY) /
		MAX_MOCK_CONTRIBUTIONS_PER_DAY;
	const intensity = seededNoise(year, dayOfYear, 2);
	const lowBiasedCount = 2 + intensity ** 1.9 * 18;
	const sourceLift = sourceWeight ** 0.85 * 10;
	const mediumLift =
		seededNoise(year, dayOfYear, 3) > 0.86
			? 6 + seededNoise(year, dayOfYear, 4) * 12
			: 0;
	const rareTower =
		seededNoise(year, dayOfYear, 5) > 0.975
			? 26 + seededNoise(year, dayOfYear, 6) * 28
			: 0;

	return clampMockCount(lowBiasedCount + sourceLift + mediumLift + rareTower);
};

export const buildMockContributionCalendar = (
	year: number,
): ContributionCalendar => {
	const firstDay = new Date(Date.UTC(year, 0, 1));
	const lastDay = new Date(Date.UTC(year, 11, 31));
	const firstWeekStart = new Date(firstDay);
	firstWeekStart.setUTCDate(firstDay.getUTCDate() - firstDay.getUTCDay());

	const weeks: ContributionWeek[] = [];
	const currentDate = new Date(firstWeekStart);

	while (currentDate <= lastDay) {
		const weekStart = new Date(currentDate);
		const contributionDays: ContributionDay[] = [];

		for (let weekday = 0; weekday < 7; weekday++) {
			const day = new Date(weekStart);
			day.setUTCDate(weekStart.getUTCDate() + weekday);
			const isInYear = day.getUTCFullYear() === year;
			const contributionCount = isInYear
				? getMockContributionCount(day, year)
				: 0;

			contributionDays.push({
				color: getColor(contributionCount),
				contributionCount,
				date: toDate(day),
				weekday,
			});
		}

		weeks.push({
			firstDay: toDate(weekStart),
			contributionDays,
		});

		currentDate.setUTCDate(currentDate.getUTCDate() + 7);
	}

	const totalContributions = weeks.reduce(
		(total, week) =>
			total +
			week.contributionDays.reduce(
				(weekTotal, day) => weekTotal + day.contributionCount,
				0,
			),
		0,
	);

	return {
		colors: contributionColors,
		totalContributions,
		weeks,
	};
};
