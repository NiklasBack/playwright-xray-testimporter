import fs from 'node:fs';
import CompareTestCase from '../../src/compareTestCase';
import type { GetTests } from '../../src/types/xrayGetTestsTypes';
import type { XrayTestCase } from '../../src/types/xrayTypes';

test('Last Step Removed', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/testStepDeleted.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual([
    {
      addedSteps: [],
      deletedSteps: [
        {
          stepId: '275d18f4-a573-4839-a3d8-07d458b35bde',
        },
      ],
      modifiedSteps: [
        {
          stepId: 'bbf472cc-3d2b-44d3-a0c5-77e3415ae9eb',
          action: 'Verify header',
        },
      ],
      issueId: '531011',
      testCaseName: '',
      tesKaseKey: 'TES-587',
    },
  ]);
}, 200000);

test('First Steps Removed', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/firstTestStepDeleted.json', 'utf-8'));
  const expectedResult = JSON.parse(fs.readFileSync('./test/testComparer/testData/expectedResponse/firstTestStepDeleted.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);

test('All Steps Removed', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/allTestStepDeleted.json', 'utf-8'));
  const expectedResult = JSON.parse(fs.readFileSync('./test/testComparer/testData/expectedResponse/allTestStepDeleted.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);
