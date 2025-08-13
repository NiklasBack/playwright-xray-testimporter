//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Erbjudande_SkapaEditeraAvsluta', async ({ page, loginPage, changeStorePage }) => {
  if (process.env.isMobile?.includes('true'))
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740l.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till sortiment_Erbjudande', async () => {

    await page.getByRole('button', { name: 'APPAR' }).click();
    //await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();

    if (process.env.isMobile?.includes('true')) {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Erbjudanden').click();
      await page.waitForTimeout(5000);
      await page.getByRole('button', { name: 'Skapa' }).click();
      //await page.getByText('Order till kassa').click();
      //await page.getByRole('button', { name: 'Skapa' }).click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      await page.getByLabel('Erbjudanden').click();
      await page.waitForTimeout(5000);
      await page.getByRole('button', { name: 'Skapa nytt erbjudande' }).first().click();
      //await page.getByLabel('Order till kassa').click();
      //await page.getByRole('button', { name: 'Skapa ny order' }).first().click();
    }
  })

  await test.step('Sätt start/ slutdatum', async () => {
    await page.waitForTimeout(2000);
    await page.locator('.bobSelectE__content').first().click();
    await page.getByLabel('Benämning *').fill('Autotest');
    await page.getByLabel('Max antal per kund *').fill('12');
    await page.getByLabel('Startdatum').fill('2023-10-01');
    await page.getByLabel('Slutdatum').fill('2023-10-03');
    await page.getByLabel('Slutdatum').press('Enter');
  })
  //VARFÖR ERROR? BEHÖVER KALENDERN STÄNGAS MED ENTER FÖRST?
  await test.step('Belopp', async () => {
    await page.getByText('Beloppsgräns').click();
    await page.waitForTimeout(2000);
    await page.locator('#internal-radio1').click();
    await page.getByLabel('Belopp').fill('123');
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByText('Kravartiklar och antal (X)*').click();
    await page.waitForTimeout(2000);
    await page.locator('#articleSearchButton').click();
    await page.waitForTimeout(2000);
    await page.locator('#internal-bobArticleSearchForm__input').fill(TestData.testArticle7318690492443.name);
    await page.waitForTimeout(2000);
  })

  await test.step('Starta erbjudandet', async () => {
    await page.locator('bob-x-card-row').filter({ hasText: TestData.testArticle7318690492443.ean }).locator('bob-x-icon-plus-circle svg').click({ timeout: 20000 });
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Totalt 1 artikel' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByText('Kundgrupp och värde (Y)*').click();
    await page.waitForTimeout(2000);
    await page.locator('#internal-switch0').check();
    await page.getByLabel('Värde (pris/erbjudande exkl. pant)').fill('12');
    await page.getByLabel('Kvittobenämning *').fill('Autotest');
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Starta erbjudande nu' }).click();
    await page.waitForTimeout(2000);
  })

  await test.step('Avsluta erbjudandet', async () => {
    await page.getByPlaceholder('Sök erbjudande').fill('Autotest');
    await page.getByRole('button', { name: /Autotest Avsluta idag.*Alla/ }).click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Värde (pris/erbjudande exkl. pant)').fill('11');
    await page.getByLabel('Max antal per kund *').fill('34');
    await page.getByText('Beloppsgräns').click();
    await page.waitForTimeout(2000);
    await page.locator('#internal-radio0').check();
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara kundgrupp' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'OK' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Avsluta' }).first().click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ja' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Erbjudanden' }).click();
    await page.waitForTimeout(2000);
  })
});