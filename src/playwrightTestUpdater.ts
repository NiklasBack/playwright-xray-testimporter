import { readFileSync } from 'node:fs';
import { readdir, writeFile } from 'node:fs/promises';

export default class PlayWrightTestUpdater {
  private readTestFolder: string = './tests';
  private writeTestFolder: string;

  constructor(readTestFolder: string, writeTestFolder: string) {
    this.readTestFolder = readTestFolder;
    this.writeTestFolder = writeTestFolder;
  }

  async update(testCases: string[], testIds: string[]) {
    if (testCases.length !== testIds.length) {
      console.error(`Number of imported testcases (${testIds.length}) differs from number of test cases to import (${testCases.length})`);
      process.exit(-1);
    }
    const files: string[] = await this.getFiles();

    for (const file in files) {
      let updatedWithKey = '';
      let replaced: string = readFileSync(`${this.readTestFolder}/${files[file]}`, 'utf-8');
      testCases.forEach(async (testCase, index) => {
        const regExp = new RegExp(`test\\('.*${testCase}`);
        replaced = replaced.replace(regExp, `test('${testIds[index]} | ${testCase}`);
        if (replaced.includes(testIds[index])) {
          console.log(`Updated: ${testIds[index]} | ${testCase}`);
          updatedWithKey = testIds[index];
        }
      });
      if (replaced.includes(updatedWithKey)) await writeFile(`${this.writeTestFolder}/${files[file]}`, replaced);
    }
  }

  private async getFiles() {
    let files: string[] = [];
    try {
      files = await readdir(this.readTestFolder);
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
