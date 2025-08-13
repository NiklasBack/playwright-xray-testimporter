//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Artiklar. Sok Artiklar', async ({ page, loginPage, changeStorePage, waitForApi }) => {

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
            await expect(page.getByRole('tab', { name: 'Butik' })).toBeEnabled();
            await page.getByLabel('Artiklar').click();
        }
    })

    await test.step('Sök artikel', async () => {
        await page.getByPlaceholder('Sök').fill(TestData.testArticle7318690181972.ean);
        await page.getByText(TestData.testArticle7318690181972.ean).click();
        await page.locator('#article').getByText(TestData.testArticle7318690181972.ean).click({timeout:20000});
        await page.getByRole('button', { name: 'Sök', exact: true }).click();
    })
});