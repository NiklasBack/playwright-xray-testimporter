//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar_Lagg-till-pa-ehandel_E-handelsartiklar_Lagg-till-redigera-ta-bort-artikel-och-pris_EHL', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

  //
  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740ci.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);
  })

  await test.step('Gå till artiklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Artiklar').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Ta bort', async () => {
    await page.getByText('Artiklar på e-handel (e-handelslgr)').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').fill(TestData.testArticle7054980018749.ean);
    //Todo: Ersätt nedanstående med ID
    await page.getByRole('row', { name: TestData.testArticle7054980018749.name }).getByLabel('').check();
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.getByRole('button', { name: 'Ta bort 1 artikel från e-handel' }).click();
    await page.getByRole('button', { name: 'Ja' }).click();
    await page.getByRole('button', { name: 'Tillbaka' }).click();
  })

  await test.step('Lägg till', async () => {
      await page.getByText('Lägg till på e-handel (e-handelslgr)').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').fill(TestData.testArticle7054980018749.ean);
    await page.getByLabel('Visa filter').click();
    await page.getByLabel('Startdatum').fill('2018-11-12');
    await page.getByLabel('Startdatum').press('Enter');
    await page.getByRole('button', { name: 'Filtrera' }).click();
    //Todo: Ersätt nedanstående med ID
    await page.getByRole('row', { name: TestData.testArticle7054980018749.name }).getByLabel('').check();
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('12');
    await page.getByLabel('', { exact: true }).check();
    await page.getByRole('button', { name: 'Publicera artiklar på e-handel' }).click();
  })

  await test.step('Ändra pris', async () => {
    await page.getByText('Artiklar på e-handel (e-handelslgr)').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').fill(TestData.testArticle7054980018749.ean);
    //Todo: Ersätt nedanstående med ID
    await page.getByRole('row', { name: TestData.testArticle7054980018749.name }).getByLabel('').check();
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.getByRole('button', { name: 'Ändra pris för 1 artikel' }).click();
    await page.getByLabel('', { exact: true }).uncheck();
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('11');
    await page.getByRole('button', { name: 'Publicera artiklar på e-handel' }).click();
  })

});