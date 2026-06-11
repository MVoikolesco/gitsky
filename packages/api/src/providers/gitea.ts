import type { GitProvider } from "./types.js";

function notImplemented(): never {
  throw new Error("not implemented");
}

export const giteaProvider: GitProvider = {
  id: "gitea",
  name: "Gitea",
  async authenticate() {
    notImplemented();
  },
  async getUser() {
    notImplemented();
  },
  async getOrganizations() {
    notImplemented();
  },
  async getRepositories() {
    notImplemented();
  },
  async getCommits() {
    notImplemented();
  },
  async getContributions() {
    notImplemented();
  },
  async getPullRequests() {
    notImplemented();
  },
  async getIssues() {
    notImplemented();
  },
};
