import { buildMockContributionCalendar, mockProfile } from "./mockCalendar";

type GraphQLBody = {
	query?: string;
	variables?: Record<string, unknown>;
};

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

interface GiteaStore {
	calendars: Record<number, ContributionCalendar>;
	userLogin: string | null;
}

// Function to get Gitea store data from localStorage
const getGiteaStoreData = (): GiteaStore | null => {
	try {
		const stored = localStorage.getItem("gitea-storage");
		if (!stored) return null;

		const parsed = JSON.parse(stored);
		return parsed?.state as GiteaStore;
	} catch {
		return null;
	}
};

const jsonResponse = (data: unknown) =>
	new Response(JSON.stringify({ data }), {
		status: 200,
		headers: {
			"content-type": "application/json",
		},
	});

export const isMockMode = () => import.meta.env.PUBLIC_USE_MOCKS === "true";

export const mockGraphQLFetch: typeof fetch = async (_input, init) => {
	const body =
		typeof init?.body === "string"
			? (JSON.parse(init.body) as GraphQLBody)
			: ({} as GraphQLBody);
	const query = body.query ?? "";
	const variables = body.variables ?? {};

	if (query.includes("query UserQuery")) {
		// Check if we have Gitea data with user login
		const giteaData = getGiteaStoreData();
		if (giteaData?.userLogin) {
			return jsonResponse({
				viewer: {
					name: giteaData.userLogin,
					login: giteaData.userLogin,
					avatarUrl: mockProfile.avatarUrl,
				},
			});
		}

		return jsonResponse({
			viewer: mockProfile,
		});
	}

	if (query.includes("query SearchUsers")) {
		const term = String(variables.query ?? "mock");
		return jsonResponse({
			search: {
				nodes: [
					mockProfile,
					{
						login: term.replace(/\s+/g, "-").toLowerCase() || "mock-user",
						avatarUrl: mockProfile.avatarUrl,
					},
				],
			},
		});
	}

	if (query.includes("query ContributionQuery")) {
		const start = String(
			variables.start ?? `${new Date().getUTCFullYear()}-01-01`,
		);
		const year = Number.parseInt(start.slice(0, 4), 10);

		// Check if we have Gitea data
		const giteaData = getGiteaStoreData();
		if (giteaData?.calendars?.[year]) {
			// Use pre-processed calendar for this year
			console.log(`Usando calendário Gitea para ${year}`);
			return jsonResponse({
				user: {
					contributionsCollection: {
						contributionCalendar: giteaData.calendars[year],
					},
				},
			});
		}

		// Fallback to mock data if no Gitea data
		return jsonResponse({
			user: {
				contributionsCollection: {
					contributionCalendar: buildMockContributionCalendar(year),
				},
			},
		});
	}

	return jsonResponse({});
};
