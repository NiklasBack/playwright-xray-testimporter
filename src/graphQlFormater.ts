import type { ModifiedTest } from './types/modifiedTest';
import type { ClientConfiguration } from './types/xrayTypes';

export default class GraphQlFormater {
  private jiraUrl: string;

  constructor(config: ClientConfiguration) {
    this.jiraUrl = config.jira.url;
  }

  mutations: string[] = [];
  createRequest(testCase: ModifiedTest) {
    this.mutations = [];
    this.getMutations(testCase);
    const rename = this.getTestCaseRenameUrl(testCase);
    return { rename: rename, batch: this.mutations };
  }

  private getMutations(testCase: ModifiedTest) {
    let mutation: string = '';
    let stepCounter = 0;
    if (testCase.modifiedSteps.length !== 0) {
      testCase.modifiedSteps.forEach((step) => {
        mutation =
          mutation +
          `step${stepCounter}: updateTestStep(stepId:"${step.stepId}",step:{action:"${step.action.replace(/"/g, '\\"')}"}){warnings}\n`;
        stepCounter++;
        if (stepCounter >= 24) {
          stepCounter = 0;
          this.mutations.push(`mutation{${mutation}}`);
          mutation = '';
        }
      });
      this.mutations.push(`mutation{${mutation}}`);
    }

    if (testCase.deletedSteps.length !== 0) {
      mutation = '';
      stepCounter = 0;
      testCase.deletedSteps.forEach((step) => {
        mutation = `${mutation}step${stepCounter}: removeTestStep(stepId:"${step.stepId}")\n`;
        stepCounter++;
        if (stepCounter >= 24) {
          stepCounter = 0;
          this.mutations.push(`mutation{${mutation}}`);
          mutation = '';
        }
      });
      this.mutations.push(`mutation{${mutation}}`);
    }

    if (testCase.addedSteps.length !== 0) {
      mutation = '';
      stepCounter = 0;
      testCase.addedSteps.forEach((step) => {
        mutation =
          mutation +
          `step${stepCounter}: addTestStep(issueId:"${testCase.issueId}",step:{action:"${step.action.replace(/"/g, '\\"')}"}){id action data result}\n`;
        stepCounter++;
        if (stepCounter >= 24) {
          stepCounter = 0;
          this.mutations.push(`mutation{${mutation}}`);
          mutation = '';
        }
      });
      this.mutations.push(`mutation{${mutation}}`);
    }
  }

  private getTestCaseRenameUrl(testCase: ModifiedTest) {
    if (testCase.testCaseName === undefined || testCase.testCaseName === '') return {};
    const body = `{"fields": {"summary": "${testCase.testCaseName.replace(/"/g, '\\"')}"}}`;
    const url = `${this.jiraUrl}/rest/api/3/issue/${testCase.tesKaseKey}`;
    return { url: url, body: body };
  }
}
