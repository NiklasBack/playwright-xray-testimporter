import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import CompareTestCase from './compareTestCase';
import GraphQlFormater from './graphQlFormater';
import PlayWrightTestReader, { Mode } from './playwrightTestReader';
import type { ClientConfiguration, XrayTestCase } from './types/xrayTypes';
import { XrayService } from './xray.service';

export default class TestUpdater {
  data = readFileSync('./xray.testimporter.config.json');
  config = JSON.parse(this.data.toString()) as ClientConfiguration;
  xtr = new PlayWrightTestReader(Mode.update);
  comparer = new CompareTestCase();
  formater = new GraphQlFormater(this.config);

  async updateXray(file = '') {
    let xrayJson: XrayTestCase[] = [];
    if (file === '') xrayJson = await this.xtr.parseFiles(this.config);
    else {
      try {
        xrayJson = JSON.parse(readFileSync(file).toString());
      } catch (error) {
        console.error(`Can't read importfile: ${(error as Error).message}`);
        process.exit(-1);
      }
    }
    const testCaseseInSrc = xrayJson.flatMap((item) =>
      item.fields.summary.match(/([\w-]+) \|/)?.[1] !== undefined ? item.fields.summary.match(/([\w-]+) \|/)?.[1] : [],
    );
    const y = JSON.stringify(testCaseseInSrc).replace(/"/g, "'").replace('[', '(').replace(']', ')');
    const xs = new XrayService(this.config);
    await xs.authenticateXray();
    await xs.authenticateJira();
    var x = await xs.getTestCases(y);
    await writeFile('tcbackup.json', JSON.stringify(x), { flag: 'a' });
    var z = this.comparer.compare(xrayJson, x);
    for (const test of z) {
      const m = this.formater.createRequest(test);
      await xs.sendBatch(m.batch);
      if (!m.rename.body?.includes('{}')) await xs.renameTestCase(m.rename);
      console.log(`Updated test case title: ${test.issueId} - ${test.testCaseName}`);
    }
    return z;
  }
}
