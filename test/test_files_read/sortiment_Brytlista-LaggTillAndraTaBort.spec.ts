import { fakerSV } from '@faker-js/faker'
import { selectors } from '@playwright/test';
//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Brytlista. Lagg till andra ta bort', async ({ page, loginPage, changeStorePage }) => {
  if (process.env.isMobile?.includes('true'))
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740x.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till sortiment_Brytlista', async () => {
    selectors.setTestIdAttribute("data-test");
    await page.getByRole('button', { name: 'APPAR' }).click();
    //await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    if (process.env.isMobile?.includes('true')) {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Brytlista').click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      await page.getByLabel('Brytlista').click();
    }
  })
  const brytLista = fakerSV.lorem.word({ length: 5 }) + '-' + TestData.dateAndTime.today

  await test.step('Lägg till', async () => {
    await page.waitForTimeout(5000);
    await page.locator('#new').first().click({ timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.getByLabel('Ange namn *').fill(brytLista);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#search').first().click();
    await page.waitForTimeout(2000);
    await page.getByTestId('article-search-input').getByPlaceholder('Sök').fill(TestData.testArticle7318690501534.ean);
    await page.waitForTimeout(5000);
    await page.getByTestId(`article-search-results-article-${TestData.testArticle7318690501534.ean}`).locator('bobpb-x-icon-plus-circle path').click({ force: true });
    await page.waitForTimeout(2000);
    await page.getByLabel('Ange förpackningens utgångsdatum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Ange förpackningens utgångsdatum').press('Enter');
    await page.waitForTimeout(2000);
    await page.getByLabel('Antal dagar i öppet skick *').fill('10');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Brytlista', exact: true }).click();
    await page.getByRole('button', { name: brytLista }).click({ force: true });
  })

  await test.step('Ändra', async () => {
    //await page.locator('#search').first().click();
    // await page.getByTestId('article-search-results-article-4013265001053').locator('bobpb-x-icon-plus-circle svg').click();
    await page.waitForTimeout(3000);
    await page.getByLabel('Ange förpackningens utgångsdatum').fill(TestData.dateAndTime.beginningOfYear);
    await page.getByLabel('Ange förpackningens utgångsdatum').press('Enter');
    await page.waitForTimeout(2000);
    await page.getByLabel('Antal dagar i öppet skick *').fill('12');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(2000);
    //await page.getByRole('heading', { name: 'Autotest' })
  })

  await test.step('Ta bort', async () => {
    await page.locator('#list-remove-article').click();
    await page.getByTestId('list-delete-article-ok').getByRole('button', { name: 'OK' }).click();
    await page.getByRole('button', { name: 'Ta bort brytlista' }).first().click();
    await page.getByTestId('list-confirm-delete-ok').getByRole('button', { name: 'OK' }).click();
  })
});