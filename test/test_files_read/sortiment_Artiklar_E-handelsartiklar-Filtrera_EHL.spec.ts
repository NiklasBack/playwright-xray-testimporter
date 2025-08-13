//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';


test('sortiment_Artiklar_E-handelsartiklar-Filtrera_EHL', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true')) 
    test.skip();

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
    await page.getByLabel('Artiklar').click();
  }
  })

  await test.step('Artiklar på e-handel (e-handelslgr)', async () => {
  await page.getByText('Artiklar på e-handel (e-handelslgr)').click();
  await expect(page.getByRole('heading', { name: 'E-handelsartiklar' })).toBeVisible({ timeout: 10000 });
  })

  await test.step('Datum & avdelning', async () => {  
  await page.getByLabel('Visa filter').click();
  await expect(page.locator('bob-x-header').getByText('Filter', { exact: true })).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2000)
  await page.getByRole('button', { name: 'Artikelurval' }).click({force:true});

  await page.getByRole('checkbox', { name: 'Kolonial' }).check();

  await page.locator('bob-x-transition-slide').getByRole('button', { name: 'Filtrera' }).click();

  await page.getByLabel('Startdatum').fill('2018-01-01');

  await page.getByLabel('Startdatum').press('Enter');

  await page.getByLabel('Slutdatum').fill(TestData.dateAndTime.endOfYear);

  await page.getByLabel('Slutdatum').press('Enter');
  await page.waitForTimeout(3000)
  await page.getByRole('button', { name: 'Filtrera' }).first().click({force:true});
 
  await page.getByRole('link', { name: 'Långkornigt ris 5410673005960' }).isVisible({ timeout: 20000 });
  })
  
  await test.step('Visa endast artiklar utan pris', async () => {  
  await page.getByLabel('Visa filter').click();

  await page.getByRole('button', { name: 'Nollställ filter' }).click();

  await page.getByLabel('Visa filter').click();

  await page.getByText('Visa endast artiklar utan pris').click();

  await page.getByRole('button', { name: 'Filtrera' }).click();

  await page.getByText('Läsk Must', { exact: true }).isVisible({ timeout: 20000 });
  })
  
  await test.step('Visa endast artiklar ej färdigpreparerade för e-handel', async () => {  
  await page.getByLabel('Visa filter').click();

  await page.getByRole('button', { name: 'Nollställ filter' }).click();

  await page.getByLabel('Visa filter').click();

  await page.getByText('Visa endast artiklar ej färdigpreparerade för e-handel').click();

  await page.getByRole('button', { name: 'Filtrera' }).click();
  await page.getByRole('link', { name: 'Crema e Aroma kaff 8000070025400' }).isVisible({ timeout: 20000 });
  })
  
  await test.step('Visa endast färdigpackade artiklar', async () => {  
  await page.getByLabel('Visa filter').click();

  await page.getByRole('button', { name: 'Nollställ filter' }).click();

  await page.getByLabel('Visa filter').click();

  await page.getByText('Visa endast färdigpackade artiklar').click();

  await page.getByRole('button', { name: 'Filtrera' }).click();
  await page.getByText('Ananas Extra Sweet').isVisible({ timeout: 20000 });
  })
  
  await test.step('Visa endast artiklar som enbart finns på EHL', async () => {  
  await page.getByLabel('Visa filter').click();

  await page.getByRole('button', { name: 'Nollställ filter' }).click();

  await page.getByLabel('Visa filter').click();

  await page.getByText('Visa endast artiklar som enbart finns på EHL').click();

  await page.getByRole('button', { name: 'Filtrera' }).click();
  await page.getByText('Alkoholfri Glögg').isVisible({ timeout: 20000 });
  })
});
