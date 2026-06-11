export type GitProviderId = "github" | "gitlab" | "bitbucket" | "gitea" | "azure-devops";

export interface GitProviderAuthRequest {
  token?: string;
  baseUrl?: string;
  username?: string;
  password?: string;
}

export interface GitUser {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  profileUrl?: string;
}

export interface GitOrganization {
  id: string;
  name: string;
  displayName?: string;
  url?: string;
}

export interface GitRepository {
  id: string;
  name: string;
  fullName: string;
  url?: string;
  defaultBranch?: string;
  isPrivate?: boolean;
}

export interface GitCommit {
  id: string;
  message: string;
  authorName?: string;
  authoredAt?: string;
  repositoryId?: string;
}

export interface GitContribution {
  date: string;
  count: number;
  repositoryId?: string;
}

export interface GitPullRequest {
  id: string;
  title: string;
  state: "open" | "closed" | "merged";
  url?: string;
  repositoryId?: string;
}

export interface GitIssue {
  id: string;
  title: string;
  state: "open" | "closed";
  url?: string;
  repositoryId?: string;
}

export interface GitProvider {
  id: GitProviderId;
  name: string;
  authenticate(request: GitProviderAuthRequest): Promise<void>;
  getUser(username: string): Promise<GitUser>;
  getOrganizations(username: string): Promise<GitOrganization[]>;
  getRepositories(owner: string): Promise<GitRepository[]>;
  getCommits(repository: string): Promise<GitCommit[]>;
  getContributions(username: string): Promise<GitContribution[]>;
  getPullRequests(repository: string): Promise<GitPullRequest[]>;
  getIssues(repository: string): Promise<GitIssue[]>;
}
