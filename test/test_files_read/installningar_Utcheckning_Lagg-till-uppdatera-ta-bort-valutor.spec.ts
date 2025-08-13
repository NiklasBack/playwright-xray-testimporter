//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Installningar_Utcheckning_Lagg-till-uppdatera-ta-bort-valutor', async ({ page, loginPage, changeStorePage }) => {


  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cp.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);  //demo testbutik
  })
  await test.step('Gå till Valutor', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.locator('mb-x-overlay').getByRole('link', { name: 'Inställningar' }).click();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('heading', { name: 'Sortiment' }).isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'Utcheckning' }).click({ timeout: 15000 });
      await page.getByRole('link', { name: 'Valutor' }).locator('pos-x-icon-chevron').click();
    } else {
      await page.getByLabel('Utcheckning').click({ timeout: 15000 });
      await page.getByRole('link', { name: 'Valutor' }).click();
    }
  })


  await test.step('Uppdatera valuta - förändring tillåt växel, valutakurs, påslag', async () => {
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input-search[data-test="tender-search"] input').fill('EUR');
    await page.waitForTimeout(3000)
    await page.locator('pos-x-card-row[data-test="EUR"]').click();
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input-switch[data-test="input-switch"]').click(); // Tillåt växel/Tillåt inte växel..
    //await mbHelpers.click(testName, 'shadow/ pos-x-input-switch[data-test="input-switch"]', "Tillåt växel/Tillåt inte växel..")
    await page.waitForTimeout(3000)
    //await mbHelpers.click(testName, 'shadow/ pos-x-radio-group[data-test="radio-btn-exchange-rate-automatic"]', "Uppdatera valutakurs automatiskt") //TODO: Lägg till när implementerat (nu utgråat)
    //await page.waitForTimeout(3000)
    await page.locator('pos-x-radio[data-test="radio-btn-exchange-rate-custom"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-radio[data-test="radio-btn-exchange-rate-custom"]', "Ange egen valutakurs")
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input[data-test="self-supplied-exchange-rate-input"] input').clear();
    //await mbHelpers.clear(testName, 'shadow/ pos-x-input[data-test="self-supplied-exchange-rate-input"]', "Egen valutakurs")       
    await page.waitForTimeout(2000)
    await page.locator('pos-x-input[data-test="self-supplied-exchange-rate-input"] input').fill('2');
    //await mbHelpers.type(testName, 'shadow/ pos-x-input[data-test="self-supplied-exchange-rate-input"]', "2", "Egen valutakurs")       
    await page.waitForTimeout(3000)
    await page.locator('pos-x-radio[data-test="radio-btn-surcharge-none"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-radio[data-test="radio-btn-surcharge-none"]', "Inget påslag")
    await page.waitForTimeout(3000)
    await page.locator('pos-x-radio[data-test="radio-btn-surcharge-crowns"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-radio[data-test="radio-btn-surcharge-crowns"]', "Lägg till påslag i kronor")
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input[data-test="surcharge-input"] input').clear();
    //await mbHelpers.clear(testName, 'shadow/ pos-x-input[data-test="surcharge-input"]', "Påslag (SEK)")  
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input[data-test="surcharge-input"] input').fill('1');
    //await mbHelpers.type(testName, 'shadow/ pos-x-input[data-test="surcharge-input"]', "1", "Påslag (SEK)")  
    await page.waitForTimeout(3000)
    await page.locator('pos-x-button[data-test="save-btn"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-button[data-test="save-btn"]', "Spara ändringar")
    await page.waitForTimeout(3000)
    await page.locator('pos-x-radio[data-test="radio-btn-surcharge-percentage"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-radio[data-test="radio-btn-surcharge-percentage"]', "Lägg till påslag i procent")
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input[data-test="surcharge-input"] input').clear();
    //await mbHelpers.clear(testName, 'shadow/ pos-x-input[data-test="surcharge-input"]', "Påslag %")  
    await page.waitForTimeout(3000)
    await page.locator('pos-x-input[data-test="surcharge-input"] input').fill('1');
    //await mbHelpers.type(testName, 'shadow/ pos-x-input[data-test="surcharge-input"]', "1", "Påslag %")  
    await page.waitForTimeout(3000)
    await page.locator('pos-x-button[data-test="save-btn"]').click();
    //await mbHelpers.click(testName, 'shadow/ pos-x-button[data-test="save-btn"]', "Spara ändringar")
    await page.waitForTimeout(3000)
  })
})

