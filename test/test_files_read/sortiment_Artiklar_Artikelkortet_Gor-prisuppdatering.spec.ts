//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment_Artiklar_Artikelkortet_Gor-prisuppdatering', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till Artoklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.locator('bob-x-media-object').filter({ hasText: 'Artiklar' }).locator('div').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Sök Artikel', async () => {
    await page.getByPlaceholder('Sök').fill(TestData.testArticle7310182803546.ean);
    await expect(page.getByText(TestData.testArticle7310182803546.ean)).toBeVisible({ timeout: 60000 });
    await page.keyboard.down('Enter') //to leave field and get to articleCard when just 1 hit
    //Sortiment - Artiklar
    //TODO: Search article in list when more than one hit
    await expect(page.locator('#article').getByText(TestData.testArticle7310182803546.ean)).toBeVisible({ timeout: 20000 });
  })

  await test.step('Gör prisuppdatering', async () => {
    console.log('Gör en prisuppdatering')
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('[data-test="header-tab-price"]').click();
      await page.locator('[id=price-edit-regular-store-price]').locator('.xIconChevron.xIconChevron--right').click();
    }
    else
      await page.locator('[data-test="article-overview-card-price"]').click();

    await page.locator('#internal-regular-store-price-edit-cost-price').first().fill('10');
    await page.locator('#internal-regular-store-price-edit-price').first().fill('11');
    await page.getByRole('button', { name: 'Aktivera nu' }).click();
    await page.waitForTimeout(2000)
  })

  await test.step('Gör prisuppdatering', async () => {
    await page.locator('#internal-regular-store-price-edit-cost-price').first().fill('11');
    await page.locator('#internal-regular-store-price-edit-price').first().fill('12');
    await page.getByRole('button', { name: 'Aktivera nu' }).click();
  })
});