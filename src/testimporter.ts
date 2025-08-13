import { existsSync, readFileSync } from 'node:fs';
import PlayWrightTestReader, { Mode } from './playwrightTestReader';
import PlayWrightTestUpdater from './playwrightTestUpdater';
import type { ClientConfiguration, XrayTestCase } from './types/xrayTypes';
import { XrayService } from './xray.service';

export default class TestImporter {
  private testReader: PlayWrightTestReader;
  private xrayService: XrayService;
  config: ClientConfiguration;
  configFile: string;

  constructor(configFile: string = './xray.testimporter.config.json') {
    this.configFile = configFile;
    const data = this.readConfigFile();
    this.config = JSON.parse(data.toString());
    this.verifyConfigFile(this.config);
    this.testReader = new PlayWrightTestReader(Mode.import);
    this.xrayService = new XrayService(this.config);
  }

  async importTestCases() {
    try {
      await this.xrayService.authenticateXray();
    } catch (e) {
      console.error(`Unable to connect to xray, check client token, firewalls, proxy etc: ${(e as Error).message}`);
      process.exit(-1);
    }

    const xrayJson: XrayTestCase[] = await this.testReader.parseFiles(this.config);
    if (xrayJson.length === 0) {
      console.error(`No test cases to import. All test cases in ${this.config.test_input_folder} are already tagged`);
      process.exit(0);
    }
    const testCases = xrayJson.map((item) => item.fields.summary);
    const key = await this.xrayService.importTestCasesToXray(JSON.stringify(xrayJson));
    const resp = await this.xrayService.vaitForImportToComplete(key);
    if (resp === undefined) {
      console.error('Something went wrong waiting for import to complete');
      process.exit(-1);
    }
    // biome-ignore lint/suspicious/noExplicitAny: Allow for any
    const testIds = resp.result.issues.map((issue: { key: any }) => issue.key);
    const pu = new PlayWrightTestUpdater(this.config.test_input_folder, this.config.test_output_folder);
    pu.update(testCases, testIds);
  }

  readConfigFile() {
    try {
      return readFileSync(this.configFile);
    } catch (error) {
      console.error(`Cant find configuration file - xray.testimporter.config.json: ${(error as Error).message}`);
      process.exit(-1);
    }
  }

  verifyConfigFile(config: ClientConfiguration) {
    if (!existsSync(config.test_input_folder)) {
      console.error(`Missing input folder, got {${config.test_input_folder}}.`);
      process.exit(-1);
    }
    if (!existsSync(config.test_output_folder)) {
      console.error(`Missing output folder, got {${config.test_output_folder}}.`);
      process.exit(-1);
    }

    if (config.projectKey === undefined) {
      console.error(`Missing projectKey, got {${config.projectKey}}.`);
      process.exit(-1);
    }

    if (config.jira === undefined) {
      console.error(`Missing Jira configutation, got {${config.jira}}.`);
      process.exit(-1);
    } else {
      if (config.jira.type.includes('cloud')) {
        console.log('Using Cloud config');
        if (config.cloud.client_id === undefined || config.cloud.client_secret === undefined) {
          console.error(`Missing Xray client configutation, got {${JSON.stringify(config.cloud)}}.`);
          process.exit(-1);
        }
      } else if (config.jira.type.includes('server')) {
        console.log('Using Server config');
        if (config.server === undefined) {
          console.error(`Missing Xray server configutation, got {${JSON.stringify(config.server)}}.`);
          process.exit(-1);
        }
        if (config.server.token === undefined) {
          console.error(`Missing Xray server token configutation, got {${JSON.stringify(config.server)}}.`);
          process.exit(-1);
        }
      } else {
        console.error(`Missing Jira type, got {${config.jira}}.`);
        process.exit(-1);
      }
    }
  }
}
