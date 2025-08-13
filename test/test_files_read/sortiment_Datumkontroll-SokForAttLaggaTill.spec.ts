//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Datumkontroll. Sok for att lagga till', async ({ page, loginPage, changeStorePage }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740q.userId, TestData.testPw.passWord);
  })
  console.log('Byt butik/stanna i vald butik')
  await test.step('Logga in', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('sortiment_Datumkontroll', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();

    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Datumkontroll').click();
      await page.locator('#search').click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      await page.getByLabel('Datumkontroll').click();
      await page.getByRole('button', { name: 'Sök för att lägga till' }).first().click();
    }
  })

  await test.step('Lägg till', async () => {
    await page.locator('[data-test="article-search-input"]').getByPlaceholder('Sök').fill(TestData.testArticle7330792077762.ean);
    await page.getByText(TestData.testArticle7330792077762.ean).click();
    //HUR UNDVIKA SAMMA DATUM IGEN?
    await page.getByLabel('Ange datum för kontroll').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Extra kommentar').fill('test');
    await page.getByRole('button', { name: 'Spara' }).click();
  })
});