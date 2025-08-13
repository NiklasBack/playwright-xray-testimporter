import { Response } from '@playwright/test';
//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Datumkontroll-Filtrera', async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740q.userId, TestData.testPw.passWord);
    })

    await test.step('Byt butik/stanna i vald butik', async () => {
        await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Gå till sortiment_Datumkontroll', async () => {
        await page.getByRole('button', { name: 'APPAR' }).click();
        await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
        if (process.env.isMobile?.includes('true'))  {
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.getByText('Datumkontroll').click();
        } else {
            await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            await page.getByLabel('Datumkontroll').click();
        }
    })

    await test.step('Filtrera', async () => {
        if (process.env.isMobile?.includes('true'))  {
            await page.waitForResponse(async (response) => await isFinished(response), { timeout: 30000 });
        } else {
            await page.locator('.list-date__desktop-content').isEnabled()

        }
        await page.getByLabel('Visa filter').click();
        await page.getByRole('checkbox', { name: '11 - Kolonial - Mat' }).check();
        await page.getByRole('button', { name: 'Filtrera' }).click();
        await page.getByText('11 - Kolonial - Mat').first().click();
        await page.getByRole('button', { name: 'Tillbaka' }).click();
        await page.getByLabel('Ta bort filter').locator('svg').click();
    })
});

async function isFinished(response: Response) {
    return response.url().includes('/graphql') && response.status() === 200 && (await response.text()).includes('getDepartments')
}