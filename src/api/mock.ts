import { convertGiteaActivitiesToCalendar } from "./giteaUtils";

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

const mockProfile = {
  name: "Mock Skyline",
  login: "mock-skyline",
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

const toDate = (date: Date) => date.toISOString().slice(0, 10);

const buildContributionCalendar = (year: number) => {
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const weeks = Array.from({ length: 53 }, (_, weekIndex) => {
    const weekStart = new Date(firstDay);
    weekStart.setUTCDate(firstDay.getUTCDate() + weekIndex * 7);

    return {
      firstDay: toDate(weekStart),
      contributionDays: Array.from({ length: 7 }, (_, weekday) => {
        const day = new Date(weekStart);
        day.setUTCDate(weekStart.getUTCDate() + weekday);
        const contributionCount =
          Math.max(0, Math.round(Math.sin((weekIndex + weekday) / 2) * 5 + 5)) *
          ((weekIndex + weekday) % 5 === 0 ? 0 : 1);

        return {
          color: contributionColors[Math.min(contributionCount, 4)],
          contributionCount,
          date: toDate(day),
          weekday,
        };
      }),
    };
  });

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
    if (giteaData && giteaData.userLogin) {
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
    if (giteaData && giteaData.calendars && giteaData.calendars[year]) {
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
          contributionCalendar: buildContributionCalendar(year),
        },
      },
    });
  }

  return jsonResponse({});
};
