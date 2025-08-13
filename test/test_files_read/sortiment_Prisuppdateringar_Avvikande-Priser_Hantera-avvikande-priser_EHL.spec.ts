//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Prisuppdateringar_Avvikande-Priser_Hantera-avvikande-priser_EHL', async ({ page, loginPage, changeStorePage }) => {
  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740cc.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);
  })

  await test.step('Gå till Prisuppdateringar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Prisuppdateringar').click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      if (await page.getByLabel('Fler menyalternativ').isEnabled())
        await page.getByLabel('Fler menyalternativ').click()
      await page.getByLabel('Prisuppdateringar').click();
    }
  })

  await test.step('Avvikande priser', async () => {
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('bob-x-header .xButtonIcon--click-area').click();
      await page.getByRole('button', { name: 'Avvikande priser' }).first().click();
    } else
      await page.getByRole('button', { name: 'Se artiklar med avvikande priser' }).first().click();
    await page.getByText('Artiklar på e-handelslager').click();
  })

  await test.step('Filtrera', async () => {
    await page.getByLabel('Visa filter').click();
    await page.locator('div').filter({ hasText: /^Prislås$/ }).click();
    await page.getByText('Olåsta och låsta priser').click();
    await page.getByLabel('Ohanterade avvikelser').check();
    await page.getByRole('button', { name: 'Filtrera' }).click();
  })
  await test.step('Publicera priser', async () => {
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('bob-x-card-row').first().locator('button').first().click();
    } else
      await page.locator('tr').nth(1).locator('.xCheckbox__input').check();
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.getByLabel('', { exact: true }).uncheck();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('99');
    if (process.env.isMobile?.includes('true'))  {
      await page.getByLabel('Lås pris').click();
    } else {
      await page.locator('.PriceRecommendationDeviationSelectedOnlineCFC__desktop').click();
      await page.getByLabel('', { exact: true }).check();
    }
    await page.getByRole('button', { name: 'Publicera priser' }).click();
    //await page.getByRole('button', { name: 'Publicera' }).click();
    await page.getByRole('button', { name: 'Publicera nu' }).click();
  })
});