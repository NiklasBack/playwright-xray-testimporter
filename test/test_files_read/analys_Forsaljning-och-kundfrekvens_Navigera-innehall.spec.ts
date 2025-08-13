//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Analys_Forsaljning-och-kundfrekvens_Navigera-innehall', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740de.userId, TestData.testPw.passWord);
  });

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  });

  await test.step('Verifiera Försäljning och kundfrekvens - meny Förs.kr', async () => {

    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Analys', exact: true }).click();
    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
      await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').click();
    } else {
      await page.getByRole('heading', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
    }

    await page.getByRole('tab', { name: 'Förs. kr', exact: true }).click() //standard view today but still 
    await expect.soft(page.locator('.analysKundfrekvens__tabs')).toBeVisible();
    await expect.soft(page.locator('.analysKundfrekvens__title')).toBeVisible();
    await expect.soft(page.locator('.bobChart')).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text').first()).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text-under').first()).toBeVisible();
  });

  await test.step('Verifiera Försäljning och kundfrekvens - meny Förs.kr/h', async () => {

    //Förs.kr/h
    await page.getByRole('tab', { name: 'Förs. kr/h' }).click()
    await expect.soft(page.locator('.analysKundfrekvens__tabs')).toBeVisible();
    await expect.soft(page.locator('.analysKundfrekvens__title')).toBeVisible();
    await expect.soft(page.locator('.bobChart')).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text').first()).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text-under').first()).toBeVisible();

    /*
      await mbHelpers.click(testName, salesPerHourMenu, "Förs.kr/h")
      await mbHelpers.waitSelectorOnly(testName, innerMenuTabs, "Inre Menyn")
      await mbHelpers.waitSelectorOnly(testName, titleArea, "Titelrad")
      await mbHelpers.waitSelectorOnly(testName, chartArea, "Diagram")
      await mbHelpers.waitSelectorOnly(testName, dateTextArea, "Första Datum-text")
      await mbHelpers.waitSelectorOnly(testName, crownsTextArea, "Första Kronor-text")
    */
  });

  await test.step('Verifiera Försäljning och kundfrekvens - meny Kunder', async () => {

    //Förs.kr/h
    await page.getByRole('tab', { name: 'Kunder', exact: true }).click()
    await expect.soft(page.locator('.analysKundfrekvens__tabs')).toBeVisible();
    await expect.soft(page.locator('.analysKundfrekvens__title')).toBeVisible();
    await expect.soft(page.locator('.bobChart')).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text').first()).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text-under').first()).toBeVisible();
    /* 
     await mbHelpers.click(testName, customerMenu, "Kunder")
     await mbHelpers.waitSelectorOnly(testName, innerMenuTabs, "Inre Menyn")
     await mbHelpers.waitSelectorOnly(testName, titleArea, "Titelrad")
     await mbHelpers.waitSelectorOnly(testName, chartArea, "Diagram")
     await mbHelpers.waitSelectorOnly(testName, dateTextArea, "Första Datum-text")
     await mbHelpers.waitSelectorOnly(testName, crownsTextArea, "Första Kronor-text")
   */

  });

  await test.step('Verifiera Försäljning och kundfrekvens - meny Kunder/h', async () => {

    //Förs.kr/h
    await page.getByRole('tab', { name: 'Kunder/h' }).click()
    await expect.soft(page.locator('.analysKundfrekvens__tabs')).toBeVisible();
    await expect.soft(page.locator('.analysKundfrekvens__title')).toBeVisible();
    await expect.soft(page.locator('.bobChart')).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text').first()).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text-under').first()).toBeVisible();
    /*
      await mbHelpers.click(testName, customerPerHourMenu, "Kunder/h")
      await mbHelpers.waitSelectorOnly(testName, innerMenuTabs, "Inre Menyn")
      await mbHelpers.waitSelectorOnly(testName, titleArea, "Titelrad")
      await mbHelpers.waitSelectorOnly(testName, chartArea, "Diagram")
      await mbHelpers.waitSelectorOnly(testName, dateTextArea, "Första Datum-text")
      await mbHelpers.waitSelectorOnly(testName, crownsTextArea, "Första Kronor-text")
    */

  });

  await test.step('Verifiera refreshad Försäljning och kundfrekvens - meny Förs.kr', async () => {

    //Förs.kr/h
    await page.getByRole('tab', { name: 'Förs. kr', exact: true }).click()

    if (process.env.isMobile?.includes('true')) 
      await page.locator('#update').click()
    else
      await page.getByRole('button', { name: 'Uppdatera' }).first().click()

    await expect.soft(page.locator('.analysKundfrekvens__tabs')).toBeVisible();
    await expect.soft(page.locator('.analysKundfrekvens__title')).toBeVisible();
    await expect.soft(page.locator('.bobChart')).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text').first()).toBeVisible();
    await expect.soft(page.locator('.bobChartLegend__text-under').first()).toBeVisible();
    /*
      await mbHelpers.click(testName, salesMenu, "Förs.kr")
      await mbHelpers.click(testName, refreshButton, "Uppdatera")
      await mbHelpers.waitSelectorOnly(testName, innerMenuTabs, "Inre Menyn")
      await mbHelpers.waitSelectorOnly(testName, titleArea, "Titelrad")
      await mbHelpers.waitSelectorOnly(testName, chartArea, "Diagram")
      await mbHelpers.waitSelectorOnly(testName, dateTextArea, "Första Datum-text")
      await mbHelpers.waitSelectorOnly(testName, crownsTextArea, "Första Kronor-text")
    */
  });

})
