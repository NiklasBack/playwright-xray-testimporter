export interface XrayGetTests {
  getTests: GetTests;
}

export interface GetTests {
  results: Result[];
}

export interface Result {
  issueId: string;
  steps: Step[];
  jira: Jira;
}

export interface Step {
  id: string;
  action: string;
}

export interface Jira {
  key: string;
  summary: string;
}
