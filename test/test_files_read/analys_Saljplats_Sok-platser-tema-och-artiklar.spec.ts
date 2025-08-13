import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';


test('Analys_Saljplats_Sok-platser-tema-och-artiklar', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740s.userId, TestData.testPw.passWord);
  });

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore3);  //demo testbutik
  });

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

  });

  await test.step('Sök plats', async () => {
    await page.getByRole('tab', { name: 'Plats' }).click();
    await page.getByRole('button', { name: 'Vecka v' }).click();
    await page.getByText('månader bakåt').click();
    await page.getByPlaceholder('Sök säljplatser via  namn').fill('mejeri');
    await page.getByPlaceholder('Sök säljplatser via  namn').press('Enter');
    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: '1. Mejeri gavel' }).locator('.xCardRow__chevron').click();
      await page.getByLabel('Tillbaka').first().click();
    } else {
      await page.getByRole('button', { name: 'Mejeri Kistan' }).getByLabel('').check({timeout:20000});
      await page.getByRole('button', { name: 'Visa som diagram' }).click();
      await page.getByLabel('Stäng', { exact: true }).click();
    }
  });

  await test.step('Sök tema', async () => {
    await page.getByRole('tab', { name: 'Tema' }).first().click();
    await page.getByRole('button', { name: 'Vecka v' }).click();
    await page.getByText('månader bakåt').click();
    await page.waitForResponse(async (response) => await isFinished(response, 'getSalesThemesForStore'), { timeout: 30000 });
    await page.getByRole('button', { name: '12 månader' }).click();
    await page.getByText('månader bakåt').click();
    await page.locator('bob-x-input-search div').first().click();
    await page.getByPlaceholder('Sök säljteman via  namn eller').fill('pasta');
    await page.getByRole('button', { name: 'Pasta & Tomater Pågående' }).click();
    await page.getByRole('button', { name: 'Tillbaka' }).click();
  });

  await test.step('Sök artikel', async () => {
    await page.getByRole('tab', { name: 'Artiklar' }).click();
    await page.getByRole('button', { name: 'Vecka v' }).click();
    await page.getByText('månader bakåt').click();
    await page.getByPlaceholder('Sök artiklar').fill(TestData.testArticleEAN13Long.article13);
    await page.getByPlaceholder('Sök artiklar').press('Enter');
    await page.getByRole('button', { name: '12 månader' }).click();
    await page.getByText('månader bakåt').click();
  });

})

async function isFinished(response: Response, text: string) {
  return response.url().includes('SALESLOCATION_THEMES_OVERVIEW') && response.status() === 200 && (await response.text()).includes(text)
}