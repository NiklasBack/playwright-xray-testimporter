//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Artiklar. Lagg till central artikel', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till artiklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    //await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny').isEnabled({ timeout: 20000 });
      await page.getByText('Artiklar').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Sök artikel centralt att lägga till', async () => {
    await page.getByLabel('Visa filter').click();
    await page.getByRole('checkbox', { name: '- Kolonial - Mat' }).check();
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.getByRole('tab', { name: 'Centralt' }).click();
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Sök').fill('value');
    await page.waitForTimeout(15000);
    //FAIL. HÄR BEHÖVS ID OCH NYTT VARJE GÅNG (HUR?)
    await page.getByText('value').first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('radio', { name: 'Manuell' }).check();
    await page.getByRole('radio', { name: 'Automatisk & saldouppföljning' }).check();
    await page.getByLabel('MPL').fill('24');
    await page.getByLabel('MPL').fill('4');
    await page.getByLabel('Prog. 4v').fill('12');
    //await page.getByRole('button', { name: 'calendar icon' }).click();
    //await page.locator('bobgas-x-input-price').filter({ hasText: 'Inköpspris kr' }).locator('div').nth(1).fill('23');
    //await page.getByLabel('26.90').fill('12');
    await page.locator('[data-test="central-article-save-button"]').getByRole('button', { name: 'Lägg till artikel' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Översikt' }).click();
  })

});