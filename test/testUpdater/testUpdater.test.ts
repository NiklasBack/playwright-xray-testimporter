import TestUpdater from '../../src/testUpdater';
import { server } from './mocks/node';

beforeAll(() => server.listen());
afterAll(() => server.close());
test('No update needed', async () => {
  const testUpdate = new TestUpdater();
  const resp = await testUpdate.updateXray('./test/testUpdater/mocks/mockRequests/xrayImporter.json');
  expect(resp.length).toBe(0);
}, 200000);

test('Test Step Removed', async () => {
  const testUpdate = new TestUpdater();
  const resp = await testUpdate.updateXray('./test/testUpdater/mocks/mockRequests/xrayImporterTestStepsRemoved.json');
  expect(resp).toEqual([
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

test('Test Step Added', async () => {
  const testUpdate = new TestUpdater();
  const resp = await testUpdate.updateXray('./test/testUpdater/mocks/mockRequests/xrayImporterTestStepsAdded.json');
  expect(resp).toEqual([
    {
      addedSteps: [
        {
          action: 'Added test step',
        },
      ],
      deletedSteps: [],
      modifiedSteps: [],
      issueId: '531011',
      testCaseName: '',
      tesKaseKey: 'TES-587',
    },
  ]);
}, 200000);

test('Rename Test Case', async () => {
  const testUpdate = new TestUpdater();
  const resp = await testUpdate.updateXray('./test/testUpdater/mocks/mockRequests/xrayImporterRAenameTest.json');
  expect(resp).toEqual([
    {
      addedSteps: [],
      deletedSteps: [],
      modifiedSteps: [],
      issueId: '473620',
      testCaseName: 'Mobilkassa-Renamed',
      tesKaseKey: 'IPA-986',
    },
  ]);
}, 200000);
