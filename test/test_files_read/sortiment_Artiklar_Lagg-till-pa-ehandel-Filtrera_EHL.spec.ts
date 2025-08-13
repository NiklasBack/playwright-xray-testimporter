import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar_Lagg-till-pa-ehandel-Filtrera_EHL', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740ci.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);
  })

  await test.step('Gå till Artiklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Artiklar').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      // await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Datum', async () => {
    await page.getByText('Lägg till på e-handel (e-handelslgr)').click();
    await page.waitForResponse(async (response) => await isFinished(response, 'merchandiseHierarchyForStore'), { timeout: 30000 });
    await page.getByLabel('Visa filter').click();

    await page.getByLabel('Startdatum').fill('2018-01-01');
    await page.getByLabel('Startdatum').press('Enter');

    await page.getByLabel('Slutdatum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Slutdatum').press('Enter');

    await page.getByRole('button', { name: 'Filtrera' }).click();

    await page.getByRole('link', { name: 'Fusion 8ct Large Pack 7702018582709' }).isVisible({ timeout: 20000 });
  })

  await test.step('Sök utan datumintervall, med avdelning', async () => {
    await page.getByLabel('Visa filter').click();

    await page.getByRole('button', { name: 'Nollställ filter' }).click();

    await page.getByLabel('Visa filter').click();

    await page.getByText('Artikelurval').click();

    await page.getByRole('checkbox', { name: 'Kolonial' }).check();

    await page.locator('bob-x-transition-slide').getByRole('button', { name: 'Filtrera' }).click();

    await page.getByText('Sök utan datumintervall').click();

    await page.locator('.bobActionSearchFilter__filter-button bob-x-button').first().click();
    await page.getByRole('link', { name: 'Agavesirap Eko 3088542506256' }).isVisible({ timeout: 20000 });
  })
});

async function isFinished(response: Response, text: string) {
  return response.url().includes('graphql?MERCHANDISE') && response.status() === 200 && (await response.text()).includes(text)
}