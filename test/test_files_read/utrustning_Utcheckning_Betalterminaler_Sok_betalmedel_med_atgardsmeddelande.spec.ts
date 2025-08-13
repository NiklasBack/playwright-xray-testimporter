
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';

test('Utrustning_Utcheckning_Betalterminaler_Sok_betalmedel_med_atgardsmeddelande',
  async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in', async () => {
      await loginPage.login(TestData.testUser_12740ct.userId, TestData.testPw.passWord)
    })

    await test.step('Byt butik/stanna i vald butik', async () => {
      console.log('')
      await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Gå till utrustning, betalterminaler', async () => {
      await page.getByRole('button', { name: 'APPAR' }).click();
      console.log('Sök betalterminal, se detaljsida och åtgärdsinfo')
      await page.getByRole('link', { name: 'Utrustning' }).first().click();

      //await mbHelpers.navigate(testName, testEnv, "/utrustning/utcheckning/betalterminaler", normalObjectAfterNavigation, "utrustning_Utcheckning-Betalterminaler")


      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Utcheckning' }).click()
      }
      else
        await page.getByLabel('Utcheckning').click();

      await page.getByText("Betalterminaler").nth(1).click();
    })

    await test.step('Rapporter i OnDemand', async () => {
      if (process.env.isMobile?.includes('false'))  {
        await expect(page.getByRole('button', { name: 'Rapporter i OnDemand' }).first()).toBeVisible();
      }
      //await mbHelpers.waitSelectorOnly(testName, 'shadow/ .xIconExternalLink', "Rapporter i OnDemand")    
      await page.locator('.xInputSearch__input').fill('Åtgärd krävs');
      await page.waitForTimeout(1000)
      //await mbHelpers.type(testName, 'shadow/ .xInputSearch__input', "Felaktig kontroll", "Sök betalterminal")
      await page.waitForTimeout(3000)
      await page.getByText('Åtgärd krävs').first().click();
      //await mbHelpers.click(testName, 'shadow/ tr[tabindex="0"]', "Första sökträffen (om flera)")
      await page.waitForTimeout(1000)
      //await mbHelpers.waitSelectorOnly(testName, 'shadow/ span[data-test="status"]', "Status")
      await expect(page.locator('[data-test="status-row"]')).toBeVisible();
      await page.waitForTimeout(1000)
      // await mbHelpers.waitSelectorOnly(testName, 'shadow/ .xTypographyBase__content', "Infomeddelande") 
      // await page.waitForTimeout(1000) 
      // await mbHelpers.waitSelectorOnly(testName, 'shadow/ .ButtonLink--primary', "Få hjälp av IT-support") 
      // await page.waitForTimeout(1000) 
      await expect(page.locator('span[data-test="status-0"]')).toBeVisible();
      //await mbHelpers.waitSelectorOnly(testName, 'shadow/ span[data-test="status-0"]', "Första radens inventeringshistorik")

    })


  })

