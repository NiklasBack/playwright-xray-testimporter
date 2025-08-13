//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar_Ta-bort-fran-ehandel-Filtrera_PIB', async ({ page, loginPage, changeStorePage, waitForApi }) => {

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740p.userId, TestData.testPw.passWord);
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

  await test.step('Datum inkl en avdelning och "extras"', async () => {
    await page.getByText('Ta bort från e-handel (butiksplock)').click();
    await page.waitForResponse(response => response.url().includes('ARTICLES_ACTION_SEARCH_QUERY') && response.status() === 200,{timeout:30000});
    await page.getByLabel('Visa filter').click();
    await page.getByText('Artikelurval').click();
    await page.getByRole('checkbox', { name: '11 - Kolonial - Mat' }).check();
    await page.getByRole('button', { name: 'Filtrera' }).first().click();
    await page.getByLabel('Startdatum').fill('2018-01-01');
    await page.getByLabel('Startdatum').press('Enter');
    await page.getByLabel('Slutdatum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Slutdatum').press('Enter');
    //lägg till: klicka ur Visa endast utgångna artiklar
    //lägg till: klicka i Inkl artiklar som inte är färdigpreppade för e-handel
    //lägg till: klicka i Inkl dolda artiklar
    await page.waitForTimeout(3000); // Mistänker att vi måste tyvärr vänta på att koden skall tröska klart
    await page.getByRole('button', { name: 'Filtrera' }).first().click({force:true});
    await page.getByRole('button', { name: 'Dold', exact: true }).isVisible({ timeout: 20000 });
  })

  await test.step('Sässonger', async () => {
    await page.getByLabel('Visa filter').click();
    await page.getByRole('button', { name: 'Nollställ filter' }).click();
    await page.getByLabel('Visa filter').click();
    await page.getByText('Säsonger').click();
    //lägg till: klicka i Alla
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.getByRole('link', { name: '3 FLAVOR EDITION 3 FLAVOR EDITION 80g x3 Vgr 673 3073781143379' }).isVisible({ timeout: 20000 });
  })
});