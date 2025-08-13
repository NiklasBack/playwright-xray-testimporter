import { readFileSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import type { ClientConfiguration, XrayStep, XrayTestCase } from './types/xrayTypes';
import { XRayTest } from './XRayTest';

export enum Mode {
  import,
  update,
}

export default class PlayWrightTestReader {
  private xrayTestCases: XrayTestCase[] = [];
  config = {} as ClientConfiguration;
  private mode: Mode;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  async parseFiles(config: ClientConfiguration) {
    this.config = config;
    let skip = false;
    let processed = false;

    const files: string[] = await this.getFiles();
    let testCase = new XRayTest();
    for (const file in files) {
      let tcFileName = files[file].replace('.spec.ts', '');
      const tc = readFileSync(`${config.test_input_folder}/${files[file]}`, 'utf-8');
      const lines = tc.split(/\r?\n/);

      for (const line in lines) {
        const testStepFound = lines[line].trimStart().match(/^await test\.step\('(.*)'/);
        const previouslyImported = lines[line].match(/^(.+?) \| /);

        skip = this.alreadyImportedTestCase(previouslyImported, skip, tcFileName);
        if (skip && this.mode === Mode.import) break;

        testCase = this.checkIfNewTestCase(lines, line, testCase);

        if (testStepFound != null && (!skip || this.mode === Mode.update)) {
          processed = true;
          tcFileName = '';
          const step: XrayStep = {
            action: testStepFound[1],
            result: '',
          };
          testCase.steps.push(step);
        }
      }

      if (processed) {
        processed = false;
      }
      skip = false;
    }

    if (testCase.fields !== undefined) this.xrayTestCases.push(testCase);

    this.checkIfDuplicate();

    if (this.mode !== Mode.update) await writeFile('xrayJson.json', JSON.stringify(this.xrayTestCases, null, 2));
    return this.xrayTestCases;
  }

  private checkIfDuplicate() {
    this.xrayTestCases.forEach((tc, idx, arr) =>
      arr.find((trc, idx2) => {
        if (this.mode === Mode.update) {
          const tcTest = tc.fields.summary.match(/([\w-]+)/)?.[1];
          const trcTest = trc.fields.summary.match(/([\w-]+)/)?.[1];
          if (tcTest === trcTest && idx !== idx2) {
            console.error(`Found duplicate test cases: \n"${tc.fields.summary}"\n"${trc.fields.summary}"\naborting.`);
            process.exit(-1);
          }
        } else if (tc.fields.summary === trc.fields.summary && idx !== idx2) {
          console.error(`Found duplicate test case "${tc.fields.summary}" - aborting.`);
          process.exit(-1);
        }
      }),
    );
  }

  private alreadyImportedTestCase(previouslyImported: RegExpMatchArray | null, skip: boolean, tcFileName: string) {
    if (previouslyImported != null) {
      skip = true;
      console.log(`Skipping ${tcFileName}`);
    }
    return skip;
  }

  private checkIfNewTestCase(lines: string[], line: string, testCase: XrayTestCase) {
    const l = lines[+line].match(/^\s*test\('(.*)'/);
    if (testCase.fields !== undefined && l !== null) {
      this.xrayTestCases.push(testCase);
      testCase = new XRayTest();
    }

    if (l !== null) {
      testCase.testtype = 'Manual';
      if (this.config.customField !== undefined) {
        testCase.fields = structuredClone(this.config.customField);
        testCase.fields.summary = l[1];
        testCase.fields.project = { key: this.config.projectKey };
      } else testCase.fields = { summary: l[1], project: { key: this.config.projectKey } };
      if (this.config.xray_test_repository_folder !== undefined)
        testCase.xray_test_repository_folder = this.config.xray_test_repository_folder;
      testCase.steps = [];
      return testCase;
    }
    return testCase;
  }

  async getFiles() {
    let files: string[] = [];
    try {
      files = await readdir(this.config.test_input_folder);
    } catch (error) {
      console.error(`Something went wrong opening input folder "${(error as Error).message}" - aborting.`);
      process.exit(-1);
    }
    try {
      for (const file in files) {
        console.log(`Found ${files[file]}`);
      }
    } catch (error) {
      console.error(`Something went wrong reading files "${(error as Error).message}" - aborting.`);
      process.exit(-1);
    }
    return files;
  }
}
