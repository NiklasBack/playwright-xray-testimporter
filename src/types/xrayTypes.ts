// biome-ignore-start lint/suspicious/noExplicitAny: Allow any

export interface XrayTestCase {
  testtype: string;
  xray_test_repository_folder: string;
  fields: Fields;
  steps: XrayStep[];
}

export interface XrayStep {
  action: string;
  data?: string;
  result: string;
}

export interface Type {
  name: string;
}

export interface Fields {
  summary: string;
  project: { key: string };
}

export interface ApiResponse {
  status: string;
  progress: string[];
  progressValue: number;
  result: Result;
}

export interface Result {
  errors: Error[];
  issues: Issue[];
  warnings: any[];
}

export interface Issue {
  elementNumber: number;
  id: string;
  key: string;
  self: string;
}

export interface Error {
  errors: ErrorDetail[];
}

export interface ErrorDetail {
  elementNumber: number;
  errors: ErrorMessage;
}

export interface ErrorMessage {
  description: string;
}

// export interface ClientConfiguration {
//     [x: string]: any;
//     client_id: string;
//     client_secret: string;
//      projectKey: string;
//      xray_test_repository_folder: string;
//      test_input_folder: string;
//      test_output_folder: string;
//      jiraAccesToken: string;
//      custom_field: {
//          field: string;
//          value: string
//      }
// }

export interface ClientConfiguration {
  [x: string]: any;
  jira: JiraConfig;
  cloud: CloudConfig;
  server: ServerConfig;
  projectKey: string;
  xray_test_repository_folder: string;
  test_input_folder: string;
  test_output_folder: string;
  custom_field: {
    field: string;
    value: string;
  };
}

export interface JiraConfig {
  url: string;
  type: 'cloud' | 'server';
  apiVersion: string;
  jiraAccesToken: string;
  jiraUserName: string;
}

export interface CloudConfig {
  client_id: string;
  client_secret: string;
  xrayUrl: string;
}

export interface ServerConfig {
  token: string;
}

// biome-ignore-end lint/suspicious/noExplicitAny: Allow any
