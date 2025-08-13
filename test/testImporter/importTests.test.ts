import TestImporter from '../../src/testimporter';

test('Verify config file - Missing Jira configutation', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingJiraConfig.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing Jira configutation, got {undefined}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing input folder', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/MissingInputFolder.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing input folder, got {undefined}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing output folder', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingOutputFolder.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing output folder, got {undefined}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing projectKey', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingProjectKey.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing projectKey, got {undefined}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing Xray client configutation Id', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingClientConfigId.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing Xray client configutation, got {{\"client_secret\":\"\"}}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing Xray client configutation Secret', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingClientConfigSecret.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing Xray client configutation, got {{\"client_id\":\"\"}}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing Server configutation', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingServerConfig.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing Xray server configutation, got {undefined}.');
  resetMocks(mockExit, logSpy);
}, 200000);

test('Verify config file - Missing Server token configutation', async () => {
  const { mockExit, logSpy } = setUpMock('./test/testImporter/configFiles/missingServerToken.json');
  expect(mockExit).toHaveBeenCalledWith(-1);
  expect(logSpy).toHaveBeenCalledWith('Missing Xray server token configutation, got {{}}.');
  resetMocks(mockExit, logSpy);
}, 200000);

// biome-ignore-start lint/suspicious/noExplicitAny: Ignore any in jest.SpyInstance
function resetMocks(
  mockExit: jest.SpyInstance<never, [code?: number | undefined], any>,
  logSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]], any>,
) {
  mockExit.mockRestore();
  logSpy.mockRestore();
}
// biome-ignore-end lint/suspicious/noExplicitAny: Ignore any in jest.SpyInstance

function setUpMock(configFile: string) {
  const logSpy = jest.spyOn(global.console, 'error');
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
    throw new Error(`process.exit: ${number}`);
  });

  try {
    expect(new TestImporter(configFile)).toThrow();
  } catch (_error) {}
  return { mockExit, logSpy };
}
