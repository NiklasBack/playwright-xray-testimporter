//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar_Lagg-till-pa-ehandel_Ta-bort-fran-ehandel-Lagg-till-redigera-ta-bort-artikel-och-pris_PIB', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true')) 
        test.skip();
  
  await test.step('Logga in', async () => {
  await loginPage.login(TestData.testUser_12740p.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
  await changeStorePage.changeStore(TestData.testStore5);
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
    await waitForApi.artiklarHeading();
    await page.getByLabel('Artiklar').click();
  }
  })

  await test.step('Ta bort arikel', async () => {
    await page.getByText('Ta bort från e-handel').click();
    await page.getByPlaceholder('Sök artikel, varumärke eller EAN').fill("7318690497448");
    await page.getByLabel('Ta bort filter').locator('svg').click();
    //Todo: Ersätt nedanstående med ID
    await page.getByRole('row', { name: 'Rapsolja' }).getByLabel('').check();
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.getByRole('button', { name: 'Ta bort 1 artikel från e-handel' }).click();
    await page.getByRole('button', { name: 'Ja' }).click();
    })
 
  await test.step('Lägg till samma', async () => {
  await page.getByText('Lägg till på e-handel').click();
  await page.getByPlaceholder('Sök artikel, varumärke eller EAN').fill("7318690497448");
  await page.getByPlaceholder('Sök artikel, varumärke eller EAN').press('Enter');
  await page.getByLabel('Visa filter').click();
  await page.getByRole('textbox', { name: 'Startdatum' }).fill('2018-01-01');
  await page.getByRole('textbox', { name: 'Startdatum' }).press('Enter');
  await page.getByRole('button', { name: 'Filtrera' }).click();
  //Todo: Ersätt nedanstående med ID
  await page.getByRole('row', { name: 'Rapsolja' }).getByLabel('').check();
  await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
  await page.getByRole('button', { name: 'Lägg till 1 artikel på e-handel' }).click();
  await page.getByRole('textbox').fill('11');
  await page.getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'Välj land' }).click();
  await page.getByText('Albanien').click();
  await page.getByRole('button', { name: 'Publicera artiklar på e-handel' }).click();
  })
});