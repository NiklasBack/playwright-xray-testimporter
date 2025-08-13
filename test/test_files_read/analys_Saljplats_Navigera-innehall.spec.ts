//@ts-ignore
import { Page } from '@playwright/test';
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Analys_Saljplats_Navigera-innehall', async ({ page, loginPage, changeStorePage }) => {


  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740s.userId, TestData.testPw.passWord);
  });

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
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

  await test.step('Navigera och verifiera Säljplats - Platser', async () => {
    await page.getByRole('tab', { name: 'Platser' }).click();
    await checkPage(page);
  });

  await test.step('Navigera och verifiera Säljplats - Tema', async () => {
    await page.getByRole('tab', { name: 'Tema' }).click();
    await checkPage(page);
  });

  await test.step('Navigera och verifiera Säljplats - Artiklar', async () => {
    await page.getByRole('tab', { name: 'Tema' }).click();
    await checkPage(page);
  });
});

async function checkPage(page: Page) {
  await expect(page.locator('.bobAslStart__tabs-wrapper')).toBeVisible({ timeout: 15000 }); //Inre menyn
  await expect(page.getByRole('tab', { name: 'Platser' })).toBeVisible({ timeout: 15000 }); //Meny Platser
  await expect(page.getByRole('tab', { name: 'Tema' })).toBeVisible({ timeout: 15000 }); //Meny Tema
  await expect(page.getByRole('tab', { name: 'Artiklar' })).toBeVisible({ timeout: 15000 }); //Meny Artiklar
  await expect(page.locator('.xInputSearch__input')).toBeVisible({ timeout: 15000 }); //Sök platser
  await expect(page.getByLabel('Visa filter')).toBeVisible({ timeout: 15000 }); //Filterknapp
  await expect(page.getByRole('button', { name: /Vecka .*/ })).toBeVisible({ timeout: 15000 }); //Periodknapp
  if (process.env.isMobile?.includes('false')) 
    await expect(page.locator('.xElementsTable--minimal').first()).toBeVisible({ timeout: 25000 }); //Tabell Med Sökträffar
}

