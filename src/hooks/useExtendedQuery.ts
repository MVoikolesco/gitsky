import type { ResultOf } from "gql.tada";
import { useEffect, useState } from "react";
import type { OperationResult } from "urql";
import { client } from "../api/client";
import { buildMockContributionCalendar } from "../api/mockCalendar";
import { ContributionQuery } from "../api/query";
import type { ContributionWeeks } from "../api/types";
import { useGiteaStore } from "../stores/gitea";

interface ExtendedQueryProps {
	name?: string;
	start: number;
	end: number;
}

export interface ExtendedQueryResult {
	years: ContributionWeeks[];
	fetching: boolean;
	ok: boolean;
}

const doRangeQuery = async (props: ExtendedQueryProps) => {
	if (props.name === undefined) {
		return [];
	}
	const { name, start, end } = props;
	const queries: Promise<
		OperationResult<ResultOf<typeof ContributionQuery>>
	>[] = [];
	for (let i = start; i <= end; i++) {
		const promise = client
			.query(ContributionQuery, {
				name,
				start: `${i}-01-01T00:00:00Z`,
				end: `${i}-12-31T00:00:00Z`,
			})
			.toPromise();
		queries.push(promise);
	}
	try {
		const results = await Promise.all(queries);
		const years: ContributionWeeks[] = [];
		for (const result of results) {
			if (result.data?.user) {
				years.push(
					result.data.user.contributionsCollection.contributionCalendar.weeks,
				);
			} else {
				return [];
			}
		}
		return years;
	} catch (_e) {
		return [];
	}
};

const buildMockYears = (start: number, end: number): ContributionWeeks[] => {
	const years: ContributionWeeks[] = [];
	for (let year = start; year <= end; year++) {
		years.push(
			buildMockContributionCalendar(year).weeks as unknown as ContributionWeeks,
		);
	}
	return years;
};

export const useExtendedQuery = (
	props: ExtendedQueryProps,
): ExtendedQueryResult => {
	const [years, setYears] = useState<ContributionWeeks[]>([[]]);
	const [fetching, setFetching] = useState(false);
	const [ok, setOk] = useState(true);
	const giteaCalendars = useGiteaStore((state) => state.calendars);
	const giteaUserLogin = useGiteaStore((state) => state.userLogin);

	useEffect(() => {
		if (props.name === undefined) {
			return;
		}

		if (giteaUserLogin && Object.keys(giteaCalendars).length > 0) {
			const giteaYears: ContributionWeeks[] = [];
			for (let year = props.start; year <= props.end; year++) {
				const calendar = giteaCalendars[year];
				if (calendar) {
					giteaYears.push(calendar.weeks as unknown as ContributionWeeks);
				} else {
					giteaYears.push(
						buildMockContributionCalendar(year)
							.weeks as unknown as ContributionWeeks,
					);
				}
			}

			setFetching(false);
			setYears(
				giteaYears.length > 0
					? giteaYears
					: buildMockYears(props.start, props.end),
			);
			setOk(true);
			return;
		}

		setFetching(true);
		setOk(true);
		setYears([[]]);
		doRangeQuery(props)
			.then((result) => {
				const years =
					result.length > 0 ? result : buildMockYears(props.start, props.end);
				setYears(years);
				if (result.length === 0) {
					setOk(true);
				}
			})
			.catch(console.error)
			.finally(() => setFetching(false));
	}, [props.name, props.start, props.end, giteaCalendars, giteaUserLogin]);
	return { years, fetching, ok };
};
