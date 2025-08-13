import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
//@ts-ignore
import { CalenderDayPage, Months } from '../page-objects/calenderDay.page.ts';

test('Sortiment_Artiklar_Artikelkortet_Lagg-till-redigera-ta-bort-brytlista', async ({ page, loginPage, changeStorePage, waitForApi }) => {
  let calender = new CalenderDayPage(page)
  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
  })

  await test.step('Gå till Artiklar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.locator('bob-x-media-object').filter({ hasText: 'Artiklar' }).locator('div').click();
    } else {
      //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      //await waitForApi.artiklarHeading();
      await page.getByLabel('Artiklar').click();
    }
  })

  await test.step('Sök Artikel', async () => {
    await page.getByPlaceholder('Sök').fill(TestData.testArticle7340005403622.ean);
    await page.getByText(TestData.testArticle7340005403622.ean).isEnabled({ timeout: 60000 });
    await page.getByPlaceholder('Sök').press('Enter');
    await page.locator('.header__article-object').isVisible({ timeout: 20000 });

  })

  await test.step('Lägg till', async () => {
    // Städa bort ett datumkontroll om det finns
    await page.waitForResponse(async (response) => await isFinished(response, '7340005403622'), { timeout: 30000 });
    await expect(page.getByText('Försäljning & Lönsamhet')).toBeVisible({timeout:20000})
    await page.waitForTimeout(2000);
    if (await page.getByText('Datumkont.').isVisible()) {
      await page.getByText('Datumkont.').click();
      await page.getByRole('button', { name: 'Ta bort' }).click();
      await page.getByRole('button', { name: 'Ja' }).click();
    }
    await page.getByText('Datum/Bryt').click();
    await page.getByRole('button', { name: 'Lägg artikeln i brytlista' }).click();
    await page.getByRole('button', { name: 'Hårdost' }).click();
    await calender.setExpiryDate(TestData.dateAndTime.today);
    await page.getByLabel('Antal dagar i öppet skick *').fill('10');
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(3000)
  })

  await test.step('Redigera', async () => {
    await page.getByText('Brytlista').nth(0).click();
    await calender.setExpiryDate(TestData.dateAndTime.tomorrow);
    await page.getByLabel('Antal dagar i öppet skick *').fill('12');
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(3000)
  })

  await test.step('Ta bort', async () => {
    await page.locator('#article').getByText('Brytlista').click();
    await page.getByRole('button', { name: 'Ta bort' }).click();
    await page.getByRole('button', { name: 'Ja' }).click();
    await page.waitForTimeout(3000)
  })
});

async function isFinished(response: Response, text: string) {
  return response.url().includes('GLOBAL_ARTICLE_ARTICLE') && response.status() === 200 && (await response.text()).includes(text)
}