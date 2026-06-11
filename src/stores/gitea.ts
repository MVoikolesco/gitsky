import { create } from "zustand";
import { persist } from "zustand/middleware";

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
	calendars: Record<number, ContributionCalendar>; // year -> calendar
	userLogin: string | null;
	setCalendars: (
		calendars: Record<number, ContributionCalendar>,
		login: string,
	) => void;
	getCalendar: (year: number) => ContributionCalendar | null;
	clearData: () => void;
	hasGiteaData: () => boolean;
}

export const useGiteaStore = create<GiteaStore>()(
	persist(
		(set, get) => ({
			calendars: {},
			userLogin: null,
			setCalendars: (calendars, login) => set({ calendars, userLogin: login }),
			getCalendar: (year) => get().calendars[year] || null,
			clearData: () => set({ calendars: {}, userLogin: null }),
			hasGiteaData: () => Object.keys(get().calendars).length > 0,
		}),
		{
			name: "gitea-storage",
		},
	),
);
