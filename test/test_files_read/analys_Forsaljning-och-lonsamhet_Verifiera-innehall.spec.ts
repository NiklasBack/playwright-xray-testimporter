//@ts-ignore
import { Page } from '@playwright/test';
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Analys_Forsaljning-och-lonsamhet_Verifiera-innehall',
  async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in med användare och lösenord', async () => {
      await loginPage.login(TestData.testUser_12740de.userId, TestData.testPw.passWord);
    });

    await test.step('Byt butik/stanna i vald butik', async () => {
      await changeStorePage.changeStore(TestData.testStore1) //demo testbutik
    });

    await test.step('Gå till sidan', async () => {
      await page.getByRole('button', { name: 'APPAR' }).click();
      await page.getByRole('link', { name: 'Analys', exact: true }).click();
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
        await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').click({ timeout: 15000 });
      } else {
        await page.getByRole('heading', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
        await page.getByLabel('Försäljning & lönsamhet').click();
      }
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Idag', async () => {
      await page.getByRole('tab', { name: 'Nyckeltal' }).click({ timeout: 20000 });
      await expect.soft(page.locator('#Nyckeltal')).toBeVisible();
      await verifyPeriod(page, new RegExp(/Idag (.*)/), '#bobAnalysisPeriodSelector_selectedId_1001');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Igår', async () => {
      await verifyPeriod(page, new RegExp(/Igår (.*)/), '#bobAnalysisPeriodSelector_selectedId_1002');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Innevarande vecka', async () => {
      if (new Date().getDay() != 1) {
        await verifyPeriod(page, new RegExp(/Innevarande vecka (.*)/), '#bobAnalysisPeriodSelector_selectedId_1005');
      }
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Föregående vecka', async () => {
      await verifyPeriod(page, new RegExp(/Föregående vecka (.*)/), '#bobAnalysisPeriodSelector_selectedId_1003');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Innevarande månad', async () => {
      if (new Date().getDate() != 1) {
        await verifyPeriod(page, new RegExp(/Innevarande månad (.*)/), '#bobAnalysisPeriodSelector_selectedId_1006');
      }
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Föregående månad', async () => {
      await verifyPeriod(page, new RegExp(/Föregående månad (.*)/), '#bobAnalysisPeriodSelector_selectedId_1004');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Innevarande år. TO DO!', async () => {
      // if (TestData.dateAndTime.today =! (new Date().getFullYear() + "-01-01")) {
      // console.log('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Innevarande år')
      // await verifyPeriod(page, new RegExp(/Innevarande år (.*)/), '#bobAnalysisPeriodSelector_selectedId_1011');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - 5 veckor bakåt', async () => {
      await verifyPeriod(page, new RegExp(/^5 veckor bakåt (.*)/), '#bobAnalysisPeriodSelector_selectedId_1007');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - 15 veckor bakåt', async () => {
      await verifyPeriod(page, new RegExp(/15 veckor bakåt (.*)/), '#bobAnalysisPeriodSelector_selectedId_1008');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - 26 veckor bakåt', async () => {
      await verifyPeriod(page, new RegExp(/26 veckor bakåt (.*)/), '#bobAnalysisPeriodSelector_selectedId_1009');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - 12 månader bakåt', async () => {
      await verifyPeriod(page, new RegExp(/12 månader bakåt (.*)/), '#bobAnalysisPeriodSelector_selectedId_1010');
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Nyckeltal - Specifik period. TO DO!', async () => {
      // await mbHelpers.navigate(testName, testEnv, analyse_sellAndProfitabilityUrl, normalObjectAfterNavigation, "Analys Försäljning och Lönsamhet-sidan")
      // await mbHelpers.click(testName, keysMenu, "Nyckeltal-menyn")
      // await mbHelpers.waitSelectorOnly(testName, filterArea, "Filter-area")
      // await mbHelpers.click(testName, 'shadow/ .bobAnalysisPeriodSelector__middle-arrow', "Vald Period")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSlideIn_Specifik period', "Specifik period") //FAILS pga mellanslag
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSlideIn_Tidsspann', "Tidspann")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSelectE_option_WEEK', "Vecka")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSlideIn_Tidsspann', "Tidspann")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSelectE_option_MONTH', "Månad")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSlideIn_Tidsspann', "Tidspann")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSelectE_option_YEAR', "År")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSlideIn_Tidsspann', "Tidspann")
      // await page.waitForTimeout(3000)
      // await mbHelpers.click(testName, 'shadow/ #bobSelectE_option_DAY', "Dag")
      // await page.waitForTimeout(3000) 
      // await mbHelpers.click(testName, 'shadow/ #bobAnalysisCustomPeriod__saveButton ', "Spara")
      // await page.waitForTimeout(3000) 
      // await mbHelpers.waitSelectorOnly(testName, previousPeriodButton, "Föregående Period Pil")
      // await mbHelpers.waitSelectorOnly(testName, nextPeriodButton, "Nästa Period Pil")
      // await mbHelpers.waitSelectorOnly(testName, keysGraphsArea, "Nyckeltal Graf-area")
      // await mbHelpers.waitSelectorOnly(testName, infoIcon, "Info-ikon")
      // await mbHelpers.waitSelectorOnly(testName, firstKeysSellGraph, "Första Nyckeltal Försäljningsgraf")
      // await mbHelpers.waitSelectorOnly(testName, firstKeysSellTable, "Första Nyckeltal Försäljningstabell")
    });

    await test.step('Verifiera Försäljning och lönsamhet - meny Uppföljning', async () => {
      await page.getByRole('tab', { name: 'Uppföljning' }).click();
      await expect(page.locator('table.DynamicTable')).toBeVisible({ timeout: 20000 });
    });


  })

async function verifyPeriod(page: Page, period: RegExp, selectedId: string) {
  await expect.soft(page.locator('.xFilter')).toBeVisible();

  await page.locator('.bobAnalysisPeriodSelector__middle-arrow').click();
  await page.getByText(period).click();

  await expect.soft(page.locator(selectedId)).toBeVisible();
  await expect.soft(page.locator('.bobAnalysisPeriodSelector__left-icon')).toBeVisible();
  await expect.soft(page.locator('.bobAnalysisPeriodSelector__right-icon')).toBeVisible();
  await expect.soft(page.locator('.bobAnalysHeader__tabs')).toBeVisible();
  await expect.soft(page.locator('.xIconInfo').first()).toBeVisible();
  if (process.env.isMobile?.includes('true'))  {
    await expect.soft(page.locator('.bobAnalysisIndicator__speedometer').first()).toBeVisible();
    await page.locator('bob-x-icon-chevron').first().click();
    await expect(page.locator('.bobAnalysisKeyValueTable')).toBeVisible();
    await page.getByLabel('Tillbaka').click();
  }

  else {
    await expect.soft(page.locator('.bobAnalysisIndicator__desktop').first()).toBeVisible();
    await expect.soft(page.locator('.bobAnalysisKeyValueTable')).toBeVisible();
  }

}

