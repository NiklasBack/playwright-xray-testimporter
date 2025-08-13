import { selectors } from '@playwright/test';
//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Brytlista-SokForAttLaggaTill', async ({ page, loginPage, changeStorePage }) => {
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
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    if (process.env.isMobile?.includes('true')) {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Brytlista').click();
      await page.locator('#search').click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      await page.getByLabel('Brytlista').click();
      await page.getByRole('button', { name: 'Sök för att lägga till' }).first().click();
    }
  })

  await test.step('Sök för att lägga till', async () => {
    await page.getByTestId('article-search-input').getByPlaceholder('Sök').fill(TestData.testArticle7310240121148.ean);
    await page.waitForTimeout(4000);
    await page.getByTestId(`article-search-results-article-${TestData.testArticle7310240121148.ean}`).locator('bobpb-x-icon-plus-circle path').click({ force: true });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Hårdost' }).nth(1).click();
    await page.getByLabel('Ange förpackningens utgångsdatum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Ange förpackningens utgångsdatum').press('Enter');
    await page.waitForTimeout(4000);
    await page.getByLabel('Antal dagar i öppet skick *').fill('11');
    await page.waitForTimeout(4000);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(4000);
  })

  await test.step('Ta bort', async () => {
    await page.getByRole('button', { name: /Hårdost .* artiklar Åtgärd.*/ }).click({force:true});
    await page.waitForTimeout(4000);
    await page.getByText(TestData.testArticle7310240121148.ean).click({ force: true });
    await page.locator('#list-remove-article').click();
    await page.getByTestId('list-delete-article-ok').getByRole('button', { name: 'OK' }).click();
  })

});
