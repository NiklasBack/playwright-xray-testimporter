//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Artiklar - Artikelkortet. Navigera mellan menyerna', async ({ page, loginPage, changeStorePage, waitForApi }) => {
    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740r.userId, TestData.testPw.passWord);
    })
    await test.step('Byt butik/stanna i vald butik', async () => {
        await changeStorePage.changeStore(TestData.testStore1);
    })



    await test.step('Gå till artiklar', async () => {
        if (process.env.isMobile?.includes('true')) {
            await page.getByRole('link', { name: 'Sortiment' }).click();
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.getByText('Artiklar').click();
        } else {
            await page.getByRole('button', { name: 'APPAR' }).click();
            await page.locator('mb-x-overlay').getByRole('link', { name: 'Sortiment' }).click();
            //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            //await waitForApi.artiklarHeading();
            await page.getByLabel('Artiklar').click();
        }
    })

    //
    await test.step('Sortiment - GA ', async () => {
        await page.getByPlaceholder('Sök').fill(TestData.testArticle7350096220015.ean);
        await page.waitForTimeout(2000);
        //TODO: Search article in list when more than one hit
        await page.keyboard.press('Enter') //to leave field and get to articleCard when just 1 hit
        await expect(page.getByText(TestData.testArticle7350096220015.ean)).toBeVisible({ timeout: 20000 });
    })

    await test.step('Navigera i artikelkortets menyer', async () => {
        await page.locator('[data-test="header-tab-sales"]').click();
        await expect(page.getByRole('heading', { name: 'Försäljning' })).toBeVisible({ timeout: 20000 });

        await page.locator('[data-test="header-tab-supply"]').click();
        await expect(page.getByRole('heading', { name: 'INSTÄLLNINGAR' })).toBeVisible({ timeout: 20000 });

        await page.locator('[data-test="header-tab-price"]').click();
        await expect(page.getByRole('heading', { name: 'ORDINARIE' })).toBeVisible({ timeout: 20000 });

        await page.locator('[data-test="header-tab-info"]').click();
        await expect(page.getByRole('tab', { name: 'Artikelinfo' })).toBeVisible({ timeout: 20000 });

        await page.locator('[data-test="header-tab-shelflabels"]').click();
        await expect(page.getByRole('heading', { name: 'ETIKETTSTYP OCH ANTAL' })).toBeVisible({ timeout: 20000 });

        await page.locator('[data-test="header-tab-overview"]').click();
        if (process.env.isMobile?.includes('true'))
            await expect(page.getByRole('heading', { name: 'Varuförsörjning' })).toBeVisible({ timeout: 20000 });
        else
            await expect(page.locator('span').filter({ hasText: 'Varuförsörjning' })).toBeVisible({ timeout: 20000 });
    })
});