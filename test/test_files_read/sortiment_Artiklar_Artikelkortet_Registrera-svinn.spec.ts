//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Artiklar_Artikelkortet_Registrera-svinn', async ({ page, loginPage, changeStorePage, waitForApi }) => {
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
        await page.getByText('Artiklar').click();
    } else {
        //await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
        //await waitForApi.artiklarHeading();
        await page.getByLabel('Artiklar').click();
    }
    })
    //Migrera från Pupeteer till Playwright:

    await test.step('Sök artikel', async () => {
    await page.getByPlaceholder('Sök').fill(TestData.testArticle7310100398420.ean);
    await page.getByText(TestData.testArticle7310100398420.ean).isEnabled({ timeout: 60000 });
    await page.getByPlaceholder('Sök').press('Enter');
    await page.locator('.header__article-object').isVisible({ timeout: 20000 });
    })
    await test.step('Registrera svinn', async () => {
    await page.getByText('Registrera svinn').click({ timeout: 5000 });
    await page.getByText('Utgående datum').click({ timeout: 5000 });
    await page.getByText('Kasseras').click();
    await page.getByPlaceholder('0').fill('2');
    await page.locator('mb-x-input-number-stepper div').nth(1).click();
    })
});
