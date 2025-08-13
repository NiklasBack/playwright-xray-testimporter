import fs from 'node:fs';
import CompareTestCase from '../../src/compareTestCase';
import type { GetTests } from '../../src/types/xrayGetTestsTypes';
import type { XrayTestCase } from '../../src/types/xrayTypes';

test('Step Added Last', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/testStepAdded.json', 'utf-8'));
  const expectedResult = JSON.parse(fs.readFileSync('./test/testComparer/testData/expectedResponse/testStepAdded.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);

test('Steps Added in Middle One TC', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/testStepAddedInMiddle.json', 'utf-8'));
  const expectedResult = JSON.parse(fs.readFileSync('./test/testComparer/testData/expectedResponse/testStepAddedInMiddle.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);

test('Steps Added in Middle Two TC', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/testStepAddedInMiddleTwoTC.json', 'utf-8'));
  const expectedResult = JSON.parse(
    fs.readFileSync('./test/testComparer/testData/expectedResponse/testStepAddedInMiddleTwoTC.json', 'utf-8'),
  );
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);

test('Steps Added first', async () => {
  const testData = JSON.parse(fs.readFileSync('./test/testComparer/testData/inData/testStepAddedFirst.json', 'utf-8'));
  const expectedResult = JSON.parse(fs.readFileSync('./test/testComparer/testData/expectedResponse/testStepAddedFirst.json', 'utf-8'));
  const localData = testData.localData as XrayTestCase[];
  const remoteData = testData.remoteData as GetTests;
  const comparer = new CompareTestCase();
  const res = comparer.compare(localData, remoteData);
  expect(res).toEqual(expectedResult);
}, 200000);
