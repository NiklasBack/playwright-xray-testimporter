//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('TES-123 | Analys_Forsaljning-och-kundfrekvens_Filtrera', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740de.userId, TestData.testPw.passWord);
  });

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  });

  await test.step('Filter Försäljning och kundfrekvens', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Analys', exact: true }).click();
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').isEnabled({ timeout: 20000 });
      await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').click();
    } else {
      await page.getByRole('heading', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
    }
  });

  await test.step('Verifiera knapparna', async () => {
    await page.locator('button[aria-label="Visa filter"]').click();
    await page.locator('bob-x-button[text="Filtrera"]').click();
  });




});
