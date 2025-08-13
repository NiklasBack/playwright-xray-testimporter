//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';

test('Utrustning_Utcheckning_Betalterminaler_Filtrera',
  async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in med användare och lösenord', async () => {
      await loginPage.login(TestData.testUser_12740ct.userId, TestData.testPw.passWord);
    })

    await test.step('Byt butik/stanna i vald butik', async () => {
      await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Sök betalterminal, se detaljsida och åtgärdsinfo', async () => {
      await page.getByRole('button', { name: 'APPAR' }).click();
      await page.getByRole('link', { name: 'Utrustning' }).first().click({ timeout: 20000 });
    })

    await test.step('Gå till betalterminaler', async () => {

      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Utcheckning' }).click()
      }
      else
        await page.getByLabel('Utcheckning').click();

      await page.getByText("Betalterminaler").nth(1).click();

      if (process.env.isMobile?.includes('false'))  {
        await expect(page.getByRole('button', { name: 'Rapporter i OnDemand' }).first()).toBeVisible({ timeout: 15000 });
      }
    })

    await test.step('Test', async () => {
      // await mbHelpers.navigate(testName, testEnv, "/utrustning/utcheckning/betalterminaler", normalObjectAfterNavigation, "utrustning_Utcheckning-Betalterminaler")
      await page.waitForTimeout(1000)
      await page.getByLabel('Visa filter').click();
      //await mbHelpers.click(testName, 'shadow/ button[aria-label="Visa filter"]', "Filter")
      await page.locator('pt-x-dialog').getByText('Terminaltyp').click();

      //await mbHelpers.click(testName, 'shadow/ mb-x-meta[data-test="filter-row"]', "Första raden i filter Terminaltyp")

      //await mbHelpers.click(testName, 'shadow/ mb-x-checkbox[data-test="all-checkbox"]', "Alla")
      if (process.env.isMobile?.includes('true')) 
        await page.getByLabel('Mobil').click({ timeout: 5000 });
      else
        await page.getByLabel('Mobil').nth(1).click({ timeout: 5000 });

      //await mbHelpers.click(testName, 'shadow/ mb-x-checkbox[data-test="checkbox-1"]', "Filterval checkbox-1 (Mobil)")
      await page.getByRole('button', { name: 'Spara' }).click();
      //await mbHelpers.click(testName, 'shadow/ pos-x-button[data-test="save-btn]', "Spara")
      await page.getByRole('button', { name: 'Filtrera' }).click();
      //await mbHelpers.click(testName, 'shadow/ pos-x-button[data-test="filter-btn]', "Filtrera")
      await page.locator('[data-test="filter"] svg').click();
      //await mbHelpers.click(testName, 'shadow/ .xIconCloseXCircle', "Ta bort filter-krysset")
    })
  })

