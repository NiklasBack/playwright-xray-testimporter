import { Page, Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Analys_Saljplats_Filtrera', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740s.userId, TestData.testPw.passWord);
  });

  // await test.step('Byt butik/stanna i vald butik', async () => {
  //   await changeStorePage.changeStore(TestData.testStore1) //demo testbutik
  // });

  await test.step('Gå till sidan', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Analys', exact: true }).click();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
      await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').click({ timeout: 15000 });
    } else {
      await page.getByRole('heading', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
      await page.getByLabel('Säljplats').click();
    }
    await page.waitForResponse(async (response) => await isFinished(response, 'salesAreas'), { timeout: 30000 });
  });

  await test.step('Verifiera filter', async () => {
    await page.getByLabel('Visa filter').click();
    await checkFilter(page, 'Område', '11 Baka T', true, '');
    await checkFilter(page, 'Plats', '21. Bröd', true, '');
    await checkFilter(page, 'Ranking', 'A-säljplats', true, '#Rank_A');
    await checkFilter(page, 'Typ', 'Pelare', true, '#PILLAR');
    await checkFilter(page, 'Syfte', 'Marginal', true, '#MARGIN');
    await checkFilter(page, 'Status', 'Aktiv', true, '#INACTIVE');
    await page.getByRole('button', { name: 'Filtrera' }).click();
  });
})

async function checkFilter(page: Page, filter: string, rowItem: string, all: boolean, locator: string) {
  console.log(`Testar ${filter} med All: ${String(all)}, Lokator: ${locator}`)

  await page.locator('.xCardRow').getByRole('button', { name: `${filter}` }).locator('.xIconChevron--right').click({ timeout: 10000 });
  await expect(page.locator('.xHeader.xHeader--dialog').filter({ hasText: filter })).toBeVisible({ timeout: 15000 });
  if (all) {
    await page.waitForTimeout(1000);
    if (await page.getByRole('checkbox', { name: 'Alla' }).first().isChecked())
      await page.getByRole('checkbox', { name: 'Alla' }).first().click();
    await page.getByLabel(rowItem).first().click();
  }

  await page.getByRole('button', { name: 'Klar' }).click();
  await expect(page.locator('bob-x-header').getByText('Filter')).toBeVisible();
}

async function isFinished(response: Response, text: string) {
  return response.url().includes('SALESAREAS_QUERY') && response.status() === 200 && (await response.text()).includes(text)
}