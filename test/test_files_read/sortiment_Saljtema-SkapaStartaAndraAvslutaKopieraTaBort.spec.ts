import { fakerSV } from '@faker-js/faker';
//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Saljtema-SkapaStartaAndraAvslutaKlonaAvsluta', async ({ page, loginPage, changeStorePage }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740cg.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    console.log('Byt butik/stanna i vald butik')
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('sortiment_Säljtema', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
    await page.getByLabel('Säljtema').click();
    await page.waitForTimeout(5000);
  })

  await test.step('Skapa', async () => {
    await page.getByRole('button', { name: 'Skapa nytt Säljtema' }).first().click({ timeout: 20000 });
    // await page.waitForTimeout(2000);
  })

  const saljtema = fakerSV.commerce.product() + ' - ' + fakerSV.number.hex({ min: 0, max: 65536 });

  await test.step('BYT TILL DATUM/TIMESTAMP I NAMN', async () => {
    await page.getByLabel('Namn *').fill(saljtema);
    await page.locator('[data-test="themeEditStartDate"] label').click();
    // await page.waitForTimeout(2000);
    await page.getByLabel('Från och med').fill(TestData.dateAndTime.beginningOfYear);
    await page.getByLabel('Från och med').press('Enter');
    await page.getByLabel('Till och med').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Till och med').press('Enter');
    await page.locator('#salesThemeSalesLocation').getByText('Säljplats', { exact: true }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('BYT TILL DATUM/TIMESTAMP I NAMN', async () => {
    await page.getByPlaceholder('Sök efter säljplats/område').fill('21. bröd');
    await page.locator('#salesThemeSalesLocation').getByText('21. Bröd').click();
    await page.getByLabel('Veckomål (marginal kr) *').fill('12');
    await page.getByPlaceholder('Sök för att lägga till').click();
    // await page.waitForTimeout(2000);
    await page.getByPlaceholder('Sök', { exact: true }).fill(TestData.testArticle7350027798309.ean);
    await page.getByText(TestData.testArticle7350027798309.ean).click({timeout:20000});
    await page.getByRole('button', { name: 'Totalt 1 artikel' }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Skapa säljtema' }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('Starta uppföljning', async () => {
    await page.getByPlaceholder('Sök säljtema/EAN').fill(saljtema);
    await page.getByRole('tab', { name: 'Planerade' }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: saljtema }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Starta uppföljning' }).first().click();
    await page.getByLabel('Använd planerat startdatum (1 jan)').check();
    await page.locator('bob-x-dialog').getByRole('button', { name: 'Starta uppföljning' }).click();
    await page.getByRole('button', { name: 'Tillbaka' }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('Ändra', async () => {
    await page.getByRole('tab', { name: 'Pågående' }).click();
    // await page.waitForTimeout(2000);
    await page.getByPlaceholder('Sök säljtema/EAN').fill(saljtema);

    await page.getByRole('button', { name: saljtema }).click();
    // await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Ändra säljtema' }).first().click();
    // await page.waitForTimeout(2000);
    await page.getByLabel('Namn *').fill(saljtema + '-B');
    await page.getByLabel('Från och med').fill(TestData.dateAndTime.lastMonth);
    await page.getByLabel('Till och med').fill(TestData.dateAndTime.nextMonth);
    await page.keyboard.press('Enter')
    await page.locator('#salesThemeSalesLocation').getByText('Säljplats', { exact: true }).click();
    await page.getByPlaceholder('Sök efter säljplats/område').fill("frys");
    await page.getByText('41. Frys').click();
    await page.getByLabel('Inget mål').check();
    await page.getByPlaceholder('Sök för att lägga till').click();
    // await page.waitForTimeout(2000);

    await page.getByPlaceholder('Sök', { exact: true }).fill('7319851005779');
    await page.getByText('7319851005779').click({timeout:20000});
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Totalt 2 artiklar' }).click();
    await page.getByRole('button', { name: 'Spara säljtema' }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('Avsluta', async () => {
    await page.getByRole('button', { name: 'Avsluta uppföljning' }).first().click();
    // await page.waitForTimeout(2000);
    await page.getByLabel('Använd dagens datum').check();
    await page.locator('bob-x-dialog').getByRole('button', { name: 'Avsluta uppföljning' }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('Kopiera', async () => {
    await page.getByRole('button', { name: 'Kopiera säljtema' }).first().click();
    // await page.waitForTimeout(2000);
    await page.getByLabel('Namn *').fill(saljtema + '-C');
    await page.getByRole('button', { name: 'Skapa säljtema' }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ta bort säljtema' }).first().click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ja, ta bort säljtemat' }).click();
    // await page.waitForTimeout(2000);
  })

  await test.step('Avsluta (städa upp)', async () => {
    await page.getByPlaceholder('Sök säljtema/EAN').fill(saljtema + '-C');
    await page.getByRole('tab', { name: 'Planerade' }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: saljtema + '-C' }).click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ta bort säljtema' }).first().click();
    // await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ja, ta bort säljtemat' }).click();
    // await page.waitForTimeout(2000);
  })
  // Verifiera att tabbarna Pågående, Planerade och Avslutade är 0
});