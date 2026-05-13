import { readFileSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';
import type { ClientConfiguration, XrayStep, XrayTestCase } from './types/xrayTypes';
import { XRayTest } from './XRayTest';

export enum Mode {
  import,
  update,
}

enum parsingStates {
  proccesed,
  new,
  parsing,
}

export default class PlayWrightTestReader {
  private xrayTestCases: XrayTestCase[] = [];
  config = {} as ClientConfiguration;
  private mode: Mode;
  private parsingState = parsingStates.parsing;

  constructor(mode: Mode) {
    this.mode = mode;
  }

  async parseFiles(config: ClientConfiguration) {
    this.config = config;
    let processed = false;

    const files: string[] = await this.getFiles();
    let testCase = new XRayTest();
    for (const file in files) {
      //let tcFileName = files[file].replace('.spec.ts', '');
      const tc = readFileSync(`${config.test_input_folder}/${files[file]}`, 'utf-8');
      const lines = tc.split(/\r?\n/);

      for (const line in lines) {
        const testStepFound = lines[line].trimStart().match(/^(await test|test)\.step\(('|")(.*)('|")/);
        this.setParsingState(lines[line]);
        if (this.parsingState === parsingStates.proccesed && this.mode === Mode.import) continue;
        testCase = this.checkIfNewTestCase(lines, line, testCase);

        if (testStepFound != null && (this.parsingState === parsingStates.new || this.mode === Mode.update)) {
          processed = true;
          const step: XrayStep = {
            action: testStepFound[3],
            result: '',
          };
          testCase.steps.push(step);
        }
      }

      if (processed) {
        processed = false;
      }
    }

    if (testCase.fields !== undefined) this.xrayTestCases.push(testCase);

    this.checkIfDuplicate();

    if (this.mode !== Mode.update) await writeFile('xrayJson.json', JSON.stringify(this.xrayTestCases, null, 2));
    return this.xrayTestCases;
  }

  private checkIfDuplicate() {
    this.xrayTestCases.forEach((tc, idx, arr) => {
      // biome-ignore lint/suspicious/useIterableCallbackReturn: Ignore the return
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
      });
    });
  }

  private setParsingState(lineToCheck: string) {
    const line = lineToCheck.trimStart();
    if (line.match(/^(.+?) \| /) != null) {
      this.parsingState = parsingStates.proccesed;
      return;
    }

    if (lineToCheck.match(/^test(.+?)/) != null) {
      this.parsingState = parsingStates.new;
    }
  }

  private checkIfNewTestCase(lines: string[], line: string, testCase: XrayTestCase) {
    const l = lines[+line].match(/^\s*test\(('|")(.*)('|")/);
    if (testCase.fields !== undefined && l !== null) {
      this.xrayTestCases.push(testCase);
      testCase = new XRayTest();
    }

    if (l !== null) {
      testCase.testtype = 'Manual';
      if (this.config.customField !== undefined) {
        testCase.fields = structuredClone(this.config.customField);
        testCase.fields.summary = l[2];
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
    const testFiles: string[] = [];
    try {
      files = await readdir(this.config.test_input_folder);
    } catch (error) {
      console.error(`Something went wrong opening input folder "${(error as Error).message}" - aborting.`);
      process.exit(-1);
    }
    try {
      for (const file in files) {
        if (files[file].endsWith('.spec.ts')) {
          testFiles.push(files[file]);
          console.log(`Found ${files[file]}`);
        }
      }
    } catch (error) {
      console.error(`Something went wrong reading files "${(error as Error).message}" - aborting.`);
      process.exit(-1);
    }
    return testFiles;
  }
}
