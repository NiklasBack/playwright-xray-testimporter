import fs from 'node:fs';
import { HttpResponse, http } from 'msw';

var testsNoChange = JSON.parse(fs.readFileSync('./test/testUpdater/mocks/mockResponses/testsNoChange.json', 'utf-8'));
var testStepsNemoved = JSON.parse(fs.readFileSync('./test/testUpdater/mocks/mockResponses/testStepsRemoved.json', 'utf-8'));

export const handlers = [
  http.post('https://xray.cloud.getxray.app/api/v2/authenticate', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),
  http.get('https://x.atlassian.net/rest/api/3/myself', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),
  http.put('https://x.atlassian.net/rest/api/3/issue/IPA-986', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    });
  }),
  http.post('https://xray.cloud.getxray.app/api/v1/graphql', async ({ request }) => {
    const req = JSON.stringify(await request.json());
    if (req.includes('TES-587')) return HttpResponse.json(testStepsNemoved);
    if (req.includes('mutation'))
      return HttpResponse.json({
        data: {
          step0: {
            warnings: [],
          },
        },
      });
    return HttpResponse.json(testsNoChange);
  }),
];
