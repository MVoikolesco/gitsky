import { Client, cacheExchange, fetchExchange } from "urql";
import { isMockMode, mockGraphQLFetch } from "./mock";

export const client = new Client({
	url: "https://api.github.com/graphql",
	fetch: isMockMode() ? mockGraphQLFetch : undefined,
	exchanges: [cacheExchange, fetchExchange],
});
