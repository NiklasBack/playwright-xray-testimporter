import { writeFile } from 'node:fs/promises';
import axios, { type Axios } from 'axios';
import type { GetTests } from './types/xrayGetTestsTypes';
import type { ApiResponse, ClientConfiguration } from './types/xrayTypes';

export class XrayService {
  private axios: Axios;
  private jiraUserName: string;
  private jiraAccesToken: string;
  private client_secret: string = '';
  private client_id: string = '';
  private jiraUrl: string;
  xrayUrl: string;

  constructor(config: ClientConfiguration) {
    this.axios = axios;
    this.xrayUrl = config.cloud.xrayUrl !== undefined ? config.cloud.xrayUrl : 'https://xray.cloud.getxray.app';
    this.jiraAccesToken = config.jira.jiraAccesToken;
    this.jiraUserName = config.jira.jiraUserName;
    this.jiraUrl = config.jira.url;
    if (config.jira.type.includes('cloud')) {
      this.client_id = config.cloud.client_id;
      this.client_secret = config.cloud.client_secret;
    }

    this.axios.defaults.headers.options = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    };
  }

  async renameTestCase(rename: { url?: undefined; body?: undefined } | { url: string; body: string }) {
    if (rename.url !== undefined) {
      const data = JSON.parse(rename.body);
      const pwd = btoa(`${this.jiraUserName}:${this.jiraAccesToken}`);
      try {
        await this.axios.put(rename.url, data, {
          headers: {
            Authorization: `Basic ${pwd}`,
          },
          maxBodyLength: 107374182400, //100gb
          maxContentLength: 107374182400, //100gb
          timeout: 600000, //10min
          proxy: false,
        });
      } catch (error) {
        this.throwError(error as Error);
      }
    }
  }

  async getCustomField(issueId: string, customField: string) {
    const pwd = btoa(`${this.jiraUserName}:${this.jiraAccesToken}`);
    console.log(`Getting ${issueId}`);
    try {
      const resp = await this.axios.get(`${this.jiraUrl}/rest/api/2/search?jql=key=${issueId}&fields=${customField},value`, {
        headers: {
          Authorization: `Basic ${pwd}`,
        },
      });
      if (resp.data.issues[0].fields[customField] === null) return { value: null, id: null };
      return { value: resp.data.issues[0].fields[customField].value, id: resp.data.issues[0].fields[customField].id };
    } catch (error) {
      this.throwError(error as Error);
    }
    return { value: 'Strange', id: 'Strange' };
  }

  async deactivateUser(userId: string) {
    try {
      await this.axios.post(
        `https://api.atlassian.com/users/${userId}/manage/lifecycle/disable`,

        {
          message: 'Account deactivated',
        },
        {
          headers: {
            Authorization: `Bearer ${this.jiraAccesToken}`,
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
          maxBodyLength: 107374182400, //100gb
          maxContentLength: 107374182400, //100gb
          timeout: 600000, //10min
          proxy: false,
        },
      );
    } catch (error) {
      this.throwError(error as Error);
    }
  }

  async setCustomField(issueId: string, customField: string, id: string) {
    console.log(`Updating ${issueId}, ${customField}:${id}`);
    const pwd = btoa(`${this.jiraUserName}:${this.jiraAccesToken}`);
    const data = JSON.parse(`{"fields": {"${customField}": {"id": "${id}"}}}`);
    const url = `${this.jiraUrl}/rest/api/3/issue/${issueId}`;
    try {
      await this.axios.put(url, data, {
        headers: {
          Authorization: `Basic ${pwd}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        maxBodyLength: 107374182400, //100gb
        maxContentLength: 107374182400, //100gb
        timeout: 600000, //10min
        proxy: false,
      });
    } catch (error) {
      this.throwError(error as Error);
    }
  }

  async sendBatch(batches: string[]) {
    for (const batch of batches) {
      if (batch.includes('mutation{}')) continue;
      console.log(`-------<${batch}>----`);
      await writeFile('batchrequests.log', batch, { flag: 'a' });
      await this.graphQlRequest(batch);
    }
  }

  async authenticateXray() {
    await axios
      .post(`${this.xrayUrl}/api/v2/authenticate`, {
        client_id: this.client_id,
        client_secret: this.client_secret,
      })
      .then((request) => {
        this.axios = axios.create({
          baseURL: this.xrayUrl,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${request.data}`,
          },
        });
      })
      .catch((error) => {
        throw new Error(`Failed to autenticate to host ${this.xrayUrl} with error: ${error.message}`);
      });
  }

  async authenticateJira() {
    const pwd = btoa(`${this.jiraUserName}:${this.jiraAccesToken}`);
    await axios
      .get(`${this.jiraUrl}/rest/api/3/myself`, {
        headers: {
          Authorization: `Basic ${pwd}`,
          Accept: 'application/json',
        },
      })
      .catch((error) => {
        throw new Error(`Failed to autenticate to host ${`${this.jiraUrl}/rest/api/3/myself`} with error: ${error.message}`);
      });
  }

  async importTestCasesToXray(data: string) {
    const response = await this.postMessage(`${this.xrayUrl}/api/v1/import/test/bulk`, data);
    const key = response.data.jobId;
    return key;
  }

  private async postMessage(url: string, data: string) {
    const response = await this.axios.post(url, data, {
      maxBodyLength: 107374182400, //100gb
      maxContentLength: 107374182400, //100gb
      timeout: 600000, //10min
      proxy: false,
    });

    if (response.status !== 200) throw new Error(`${response.status} - Failed to post to ${url}`);
    return response;
  }

  async getTestCases(testCases: string): Promise<GetTests> {
    const body = `{getTests(jql: "key = ${testCases}", limit:100) {results{issueId steps{id action}jira(fields:["key","summary"])}}}`;
    const response = await this.graphQlRequest(body);
    const res = response.getTests;
    return res;
  }

  private async graphQlRequest(graphQl: string) {
    const body = { query: graphQl };
    const response = await this.axios.post(`${this.xrayUrl}/api/v1/graphql`, body, {
      maxBodyLength: 107374182400, //100gb
      maxContentLength: 107374182400, //100gb
      timeout: 600000, //10min
      proxy: false,
    });
    if (response.status !== 200) throw new Error(`${response.status} - Failed to execute GraphQl request`);
    const res = await response.data.data;
    return res;
  }

  async vaitForImportToComplete(key: string) {
    let retTries = 30;
    while (retTries >= 0) {
      const response = await this.checkImportStatus(key);
      switch (response.status) {
        case 'successful':
          return response;
        case 'failed':
          this.throwError(`${JSON.stringify(response.result)} - Failed to create import tests`);
          break;
        case 'unsuccessful':
          this.throwError(`${JSON.stringify(response.result)} - No tests were imported and job has finished`);
          break;
        case 'partially_successful':
          throw this.throwError(
            `${JSON.stringify(response.result)} - Some tests were imported sucessfully and some weren't and the job has finished.`,
          );
        case 'pending':
          break;
        case 'working':
          break;
        default:
          throw this.throwError(`${JSON.stringify(response.result)} - Cannot understand this response.`);
      }
      await new Promise((f) => setTimeout(f, 5000));
      retTries--;
    }
    return undefined;
  }

  throwError(error: unknown) {
    if (typeof error === 'string') console.error(`Error encounterd ${error}` as string);
    else console.error(`Error encounterd ${(error as Error).message}`);
    process.exit(-1);
  }

  private async checkImportStatus(key: string) {
    const response = await this.axios.get(`${this.xrayUrl}/api/v1/import/test/bulk/${key}/status`);

    if (response.status !== 200) throw new Error(`${response.status} - Failed to read import status`);
    console.log(JSON.stringify(response.data));
    return response.data as ApiResponse;
  }
}
