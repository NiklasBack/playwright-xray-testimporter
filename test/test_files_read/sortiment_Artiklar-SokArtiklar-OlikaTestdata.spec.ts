//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Artiklar. Sok Artiklar - Olika testdata', async ({ page, loginPage, changeStorePage, waitForApi }) => {

    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
    })

    await test.step('Byt butik/stanna i vald butik', async () => {
        await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Gå till artiklar', async () => {
        await page.getByRole('button', { name: 'APPAR' }).click();
        //await page.waitForTimeout(2000);
        await page.getByRole('link', { name: 'Sortiment', exact: true }).click();

        if (process.env.isMobile?.includes('true'))  {
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.getByText('Artiklar').click();
        } else {
            //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            // await waitForApi.artiklarHeading();
            await page.getByLabel('Artiklar').click();
        }
    })

    await test.step('Loopa alla typer av testdata (utöka med fler sorter i testdata.ts)', async () => {
        for (const article of TestData.testArticles) {
            //Sök artikel
            await page.getByPlaceholder("Sök").fill(article.gtin);
            await page.waitForTimeout(2000);
            await page.getByText(TestData.isMobile ? article.name : article.gtinWithZeros).click();
            await page.waitForTimeout(2000);
            const regExp = new RegExp(`.*/.*${article.gtinWithZeros}.*`);
            await expect.soft(page).toHaveURL(regExp);
            await expect.soft(page.getByText(article.gtinWithZeros).nth(0)).toBeVisible({ timeout: 20000 });
            if (process.env.isMobile?.includes('true')) 
                await page.getByLabel('Tillbaka').click()
            else
                await page.getByRole('button', { name: 'Sök', exact: true }).click();
            await page.waitForTimeout(2000);
        }
    })

});