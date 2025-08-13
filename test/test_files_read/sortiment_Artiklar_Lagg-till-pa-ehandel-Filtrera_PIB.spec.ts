import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';


test('sortiment_Artiklar_Lagg-till-pa-ehandel-Filtrera_PIB', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  if (process.env.isMobile?.includes('true'))
    test.skip();

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
    if (process.env.isMobile?.includes('true')) {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Artiklar').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Datum, och en avdelning, inkl valbara', async () => {
    await page.getByText('Lägg till på e-handel (butiksplock)').click();
    await page.waitForResponse(async (response) => await isFinished(response, 'departments'), { timeout: 30000 });
    await page.getByLabel('Visa filter').click();
    await page.getByText('Artikelurval').click();
    await page.getByRole('checkbox', { name: '11 - Kolonial - Mat' }).check();
    await page.getByRole('button', { name: 'Filtrera' }).first().click();
    await page.getByRole('textbox', { name: 'Startdatum' }).fill('2018-01-01');
    await page.getByRole('textbox', { name: 'Startdatum' }).press('Enter');

    await page.getByLabel('Slutdatum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Slutdatum').press('Enter');

    await page.getByLabel('Inkl. artiklar som inte är färdigpreparerade för e-handel').click();
    await page.getByLabel('Inkl. utgångna artiklar').click();
    await page.getByLabel('Inkl. dolda artiklar').click();
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.getByRole('link', { name: '3in1 10p 3in1 10p 10st Vgr 150 7613036900072' }).isVisible({ timeout: 20000 });
    await page.getByRole('button', { name: 'Dold', exact: true }).isVisible({ timeout: 20000 }); //kolum visas endast när "inkl dolda" vald
  })

  await test.step('Sök utan datumintervall, krävs 1 avdelning', async () => {
    await page.getByLabel('Visa filter').click();
    await page.getByRole('button', { name: 'Nollställ filter' }).click();
    await page.getByLabel('Visa filter').click();
    await page.getByText('Artikelurval').click();
    await page.getByRole('checkbox', { name: '11 - Kolonial - Mat' }).check();
    await page.getByRole('button', { name: 'Filtrera' }).first().click();
    await page.getByLabel('Sök utan datumintervall').click();
    await page.locator('.bobActionSearchFilter__filter-button bob-x-button').first().click();
    await page.getByRole('link', { name: '3in1 10p 3in1 10p 10st Vgr 150 7613036900072' }).isVisible({ timeout: 20000 });
  })

  await test.step('Sässonger', async () => {
    await page.getByLabel('Visa filter').click();
    await page.getByRole('button', { name: 'Nollställ filter' }).click();
    await page.getByLabel('Visa filter').click();
    await page.getByText('Säsonger').click();
    await page.getByLabel('Alla', { exact: true }).click();
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.getByRole('link', { name: '3 X England 3 X England 300g Vgr 672 5014442301057' }).isVisible({ timeout: 20000 });
  })

  await test.step('Kampanjer', async () => {
    await page.getByLabel('Visa filter').click();
    await page.getByRole('button', { name: 'Nollställ filter' }).click();
    await page.getByLabel('Visa filter').click();
    await page.getByText('Kampanjer', { exact: true }).click();
    await page.getByLabel('Visa artiklar i planerade kampanjer').click();
    await page.getByLabel('Visa artiklar i pågående kampanjer').click();
    await page.locator('bob-x-transition-slide').filter({ hasText: 'Visa artiklar i planerade kampanjer Visa artiklar i pågående kampanjer Startdatu' }).getByLabel('Startdatum').fill('2018-01-01');
    await page.locator('bob-x-transition-slide').filter({ hasText: 'Visa artiklar i planerade kampanjer Visa artiklar i pågående kampanjer Startdatu' }).getByLabel('Startdatum').press('Enter');
    await page.getByRole('button', { name: 'Klar', exact: true }).click();
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.getByRole('link', { name: 'Aktivitetsspel Aktivitetsspel Vgr 972 7317446002929' }).isVisible({ timeout: 20000 });
  })
});

async function isFinished(response: Response, text: string) {
  return response.url().includes('graphql?GET_DEPARTMENTS') && response.status() === 200 && (await response.text()).includes(text)
}