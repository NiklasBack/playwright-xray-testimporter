//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

import { WaitForApiCall } from '../helpers/waitfor_api_call.ts'

test('Sortiment_Artiklar_Artikelkortet_Gor-internkop', async ({ page, loginPage, changeStorePage, waitForApi }) => {
    //Logga in
    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
    })
    await test.step('Byt butik/stanna i vald butik', async () => {
        await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Gå till Appar', async () => {
        await page.getByRole('button', { name: 'APPAR' }).click();
        await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
        if (process.env.isMobile?.includes('true')) {
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.locator('bob-x-media-object').filter({ hasText: 'Artiklar' }).locator('div').click();
        } else {
            //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            //await waitForApi.artiklarHeading();
            await page.getByLabel('Artiklar').click();
        }
    })

    await test.step('Sök', async () => {
        await page.getByPlaceholder('Sök').fill(TestData.testArticle7318690497448.ean);
        await expect(page.getByText(TestData.testArticle7318690497448.ean)).toBeVisible({ timeout: 70000 });
        await page.keyboard.down('Enter') //to leave field and get to articleCard when just 1 hit
        await expect(page.locator('bobga-x-media-object').getByText(TestData.testArticle7318690497448.ean)).toBeVisible({ timeout: 20000 });

    })

    await test.step('Gör ett internköp', async () => {
        await page.getByText('Internköp').click();
        await expect(page.getByText('Välj orsak')).toBeVisible({ timeout: 20000 });
        await page.getByRole('button', { name: 'Lunchrum' }).click();
        await page.locator('label').filter({ hasText: 'st' }).fill('2');
        await page.getByText('Kommentar (frivilligt)').fill('Test');
        await page.getByRole('button', { name: 'Spara och stäng' }).click();
    })
});


