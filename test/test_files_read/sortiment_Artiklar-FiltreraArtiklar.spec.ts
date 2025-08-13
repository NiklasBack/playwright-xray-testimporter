//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar-FiltreraArtiklar', async ({ page, loginPage, changeStorePage, waitForApi }) => {

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
            await page.getByText('Artiklar').click();
        } else {
            //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            //await waitForApi.artiklarHeading();
            await page.getByLabel('Artiklar').click();
        }
    })

    await test.step('Filtrera artikelurval', async () => {
        await page.getByLabel('Visa filter').click();
        await page.getByText('Artikelurval', { exact: true }).click();
        //await page.waitForTimeout(2000);
        await page.getByRole('checkbox', { name: '11 - Kolonial - Mat' }).check();
        //await page.waitForTimeout(2000);
        await page.locator('#arrow-btn-11').click();
        //await page.waitForTimeout(2000);
        await page.getByRole('checkbox', { name: /103/ }).uncheck();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filtrera' }).click();
        //await page.waitForTimeout(2000); //FINNS 2 FILTRERA SAMTIDIGT ANNARS

        //HÄR BEHÖVS ID:
        if (process.env.isMobile?.includes('true'))  {
            await expect(page.getByText(TestData.testArticle7318690494744.ean)).toBeVisible({ timeout: 20000 });

        } else {
            await expect(page.getByText(TestData.testArticle7318690494744.ean)).toBeVisible({ timeout: 20000 });
        }
    })
});