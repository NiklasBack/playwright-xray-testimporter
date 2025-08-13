import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Sortiment - Order Till Kassa. Skapa sok skicka in', async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740f.userId, TestData.testPw.passWord);
    })

    await test.step('Byt butik', async () => {
        await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('sortiment_Order till kassa', async () => {
        await page.getByRole('button', { name: 'APPAR' }).click();
        await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
        if (process.env.isMobile?.includes('true'))  {
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.getByText('Order till kassa').click();
            await page.getByRole('button', { name: 'Skapa' }).click();
        } else {
            await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            await page.getByLabel('Order till kassa').click();
            await page.getByRole('button', { name: 'Skapa ny order' }).first().click();
        }
    })
    
    //Timestamp på minuten
    const timeStamp = TestData.dateAndTime.timeStamp
    await test.step('Skapa ny order', async () => {
        await page.getByLabel('Ange namn *').fill(timeStamp);
        await page.waitForResponse(async (response) => await isFinished(response, 'pickAndCollects'), { timeout: 30000 });
        await page.getByRole('button', { name: 'Spara' }).click();

    })

    await test.step('Sök order', async () => {
        await page.getByPlaceholder('Sök order\n').fill(timeStamp, { timeout: 10000 });
        await page.getByText(timeStamp).click();
        await page.locator('#articleSearchButton').click();
        await page.locator('#internal-bobArticleSearchForm__input').fill(TestData.testArticle7310090344131.ean);
        await page.locator('#internal-bobArticleSearchForm__input').press('Enter');
        await page.getByRole('button', { name: 'Spara' }).click();
        await page.getByRole('button', { name: 'Skicka' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        await expect(page.getByText(/OrderidDitt orderid är:.*OK/)).not.toBeVisible()
    })
});

async function isFinished(response: Response, text: string) {
    return response.url().includes('PICKANDCOLLECTS_QUERY') && response.status() === 200 && (await response.text()).includes(text)
}