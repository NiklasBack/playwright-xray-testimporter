import { readFileSync } from 'node:fs';
import PlayWrightTestReader, { Mode } from '../../src/playwrightTestReader';
import type { ClientConfiguration } from '../../src/types/xrayTypes';
import { xrayJsonExpected } from './xrayJson';

test('Create a Xray JSON import file', async () => {
  const data = readFileSync('./test/testReader/importFiles/happyPath/xray.testimporter.config.json');
  const config = JSON.parse(data.toString()) as ClientConfiguration;
  const xtr = new PlayWrightTestReader(Mode.import);
  const xrayJson = await xtr.parseFiles(config);
  expect(JSON.stringify(xrayJsonExpected)).toBe(JSON.stringify(xrayJson));
});

test('Create a Xray JSON import file with duplicate names', async () => {
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
    throw new Error(`process.exit: ${number}`);
  });
  const xtr = new PlayWrightTestReader(Mode.import);
  const data = readFileSync('./test/testReader/importFiles/duplicateTestCases/xray.testimporter.config.json');
  const config = JSON.parse(data.toString()) as ClientConfiguration;
  try {
    expect(await xtr.parseFiles(config)).toThrow();
  } catch (_error) {}

  expect(mockExit).toHaveBeenCalledWith(-1);
  mockExit.mockRestore();
}, 20000);

test('Create a Xray JSON import file with multiple test cases in one file', async () => {
  const xtr = new PlayWrightTestReader(Mode.import);
  const data = readFileSync('./test/testReader/importFiles/multipleTcPerFile/xray.testimporter.config.json');
  const config = JSON.parse(data.toString()) as ClientConfiguration;
  const result = await xtr.parseFiles(config);
  expect(result.length).toEqual(3);
}, 20000);

test('Create a Xray JSON import file with tc names with quotation marks', async () => {
  const xtr = new PlayWrightTestReader(Mode.import);
  const data = readFileSync('./test/testReader/importFiles/quotationMarks/xray.testimporter.config.json');
  const config = JSON.parse(data.toString()) as ClientConfiguration;
  const result = await xtr.parseFiles(config);
  expect(result.length).toEqual(2);
}, 20000);
