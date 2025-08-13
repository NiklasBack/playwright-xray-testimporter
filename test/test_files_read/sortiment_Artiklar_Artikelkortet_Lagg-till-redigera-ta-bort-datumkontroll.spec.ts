import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
//@ts-ignore
import {CalenderDayPage} from '../page-objects/calenderDay.page.ts'

test('Sortiment_Artiklar_Artikelkortet_Lagg-till-redigera-ta-bort-datumkontroll', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  let calendar = new CalenderDayPage(page);

  await test.step('Login', async () => {
    await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till artiklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByRole('button', { name: 'Artiklar' }).click({ force: true });
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Sök artikel', async () => {
    if (process.env.isMobile?.includes('true'))  {
    await page.waitForResponse(async (response) => await isFinished(response, 'graphql?DEPARTMENTS', 'getDepartments'), { timeout: 30000 });
    }
    await page.getByPlaceholder('Sök').fill(TestData.testArticle7350027795308.ean);
    await page.getByText(TestData.testArticle7350027795308.ean).isEnabled({ timeout: 20000 });
    await page.getByPlaceholder('Sök').press('Enter');
    await page.locator('.header__article-object').isVisible({ timeout: 20000 });
  })
  // await page.locator('#article').getByText('Brytlista').click();
  // await page.locator('#internal-edit-article-allowed-days-open-input').fill(String(Math.floor(Math.random() * 100)))
  // await page.getByRole('button', { name: 'Spara' }).click();

  await test.step('Sätt datum/ bryt', async () => {
/*     if (process.env.isMobile?.includes('false'))  {
      await page.waitForResponse(async (response) => await isFinished(response, 'graphql?ARTICLE', '4013265001053'), { timeout: 30000 });
    } */
    await expect(page.getByText('Försäljning & Lönsamhet')).toBeVisible({ timeout: 20000 })
    await page.waitForTimeout(2000);
    // Städa bort ett datumkontroll om det finns
    if (await page.getByText('Datumkont.').isVisible()) {
      await page.getByText('Datumkont.').click();
      await page.getByRole('button', { name: 'Ta bort' }).click();
      await page.getByRole('button', { name: 'Ja' }).click();
    }
    await page.getByText('Datum/Bryt').click();
    await page.getByRole('button', { name: 'Lägg artikeln för datumkontroll' }).click();

    await calendar.setExpiryDate(TestData.dateAndTime.today);
    //await page.getByLabel('Ange datum för kontroll').fill(TestData.dateAndTime.today);
    //await page.getByLabel('Ange datum för kontroll').press('Enter');
    await page.getByLabel('Extra kommentar').fill('extra kommentar');
    await page.getByLabel('Extra kommentar').press('Enter');
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(5000)
  })

  await test.step('Redigera', async () => {
    await page.getByText('Datumkont.').click();
  
    await page.getByLabel('Ange datum för kontroll').press('ArrowRight');
    await calendar.setExpiryDate(TestData.dateAndTime.tomorrow);
    //await page.getByLabel('Ange datum för kontroll').fill(TestData.dateAndTime.tomorrow);
    //await page.getByLabel('Ange datum för kontroll').press('Enter');
    await page.getByLabel('Extra kommentar').fill('annan kommentar');
    await page.getByLabel('Extra kommentar').press('Enter');
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(3000)
  })

  await test.step('Ta bort', async () => {
    await page.getByText('Datumkont.').click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.getByRole('button', { name: 'Ja' }).click();
    await page.waitForTimeout(3000)
  })
});

async function isFinished(response: Response, url: string, text: string) {
  return response.url().includes(url) && response.status() === 200 && (await response.text()).includes(text)
}