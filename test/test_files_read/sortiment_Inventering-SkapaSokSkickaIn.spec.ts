//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Inventering-SkapaSokSkickaIn', async ({ page, loginPage, changeStorePage }) => {
    if (process.env.isMobile?.includes('true')) 
        test.skip();
    
    await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740z.userId, TestData.testPw.passWord);
    })

    await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('Gå till sortiment_Etiketter', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    //await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    if (process.env.isMobile?.includes('true'))  {
        await page.getByText('Meny').isEnabled({ timeout: 20000 });
        await page.getByText('Inventering').click();
    } else {
        await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
        await page.getByLabel('Inventering').click();
    }
    })

    await test.step('sortiment_Inventering', async () => {
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Skapa ny inventering' }).first().click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Ange namn *').fill('Autotest');
    await page.waitForTimeout(2000);
    await page.getByLabel('Ange datum').fill(TestData.dateAndTime.endOfYear);
    await page.getByLabel('Ange datum').press("Enter");
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Påbörja' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#articleSearchButton').click();
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Ange PLU/EAN du vill inventera').fill(TestData.testArticle7311311014642.ean);
    await page.waitForTimeout(2000);
    await page.getByPlaceholder('Ange PLU/EAN du vill inventera').press('Enter');
    await page.waitForTimeout(2000);
    await page.getByLabel('Antal').fill('2');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara och ange nytt PLU/EAN' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'ABC' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#internal-bobArticleSearchForm__input').fill(TestData.testArticle7311311014642.name);
    await page.waitForTimeout(5000);
    await page.getByText(TestData.testArticle7311311014642.ean, { exact: true }).nth(1).click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Antal').fill('2');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Spara och stäng' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#shared-content-area-overlap').getByRole('button', { name: 'Skicka' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'OK' }).click();
    })
});