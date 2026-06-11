import { azureDevOpsProvider } from "../providers/azure-devops.js";
import { bitbucketProvider } from "../providers/bitbucket.js";
import { giteaProvider } from "../providers/gitea.js";
import { githubProvider } from "../providers/github.js";
import { gitlabProvider } from "../providers/gitlab.js";
import type { GitProvider, GitProviderId } from "../providers/types.js";

const providers = [
  githubProvider,
  gitlabProvider,
  bitbucketProvider,
  giteaProvider,
  azureDevOpsProvider,
] satisfies GitProvider[];

const providersById = new Map<GitProviderId, GitProvider>(
  providers.map((provider) => [provider.id, provider]),
);

export function listGitProviders(): GitProvider[] {
  return providers;
}

export function getGitProvider(id: GitProviderId): GitProvider | undefined {
  return providersById.get(id);
}
