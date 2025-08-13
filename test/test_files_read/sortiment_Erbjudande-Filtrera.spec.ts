//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { CalenderDayPage, Months } from '../page-objects/calenderDay.page.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Erbjudande-Filtrera', async ({ page, loginPage, changeStorePage }) => {
    const calenderDays = new CalenderDayPage(page);
    //Logga in

    await test.step('Logga in', async () => {
        await loginPage.login(TestData.testUser_12740l.userId, TestData.testPw.passWord);
    })
    await test.step('Byt butik/stanna i vald butik', async () => {

        await changeStorePage.changeStore(TestData.testStore1);
    })

    await test.step('sortiment_Erbjudande', async () => {
        await page.getByRole('button', { name: 'APPAR' }).click();
        await page.getByRole('link', { name: 'Sortiment', exact: true }).click();

        if (process.env.isMobile?.includes('true'))  {
            await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
            await page.locator('bob-x-media-object').filter({ hasText: 'Erbjudanden' }).locator('div').click();
        } else {
            await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
            await page.getByLabel('Erbjudande').click();}
    })

    await test.step('Sätt filter', async () => {
        await page.waitForTimeout(3000);
        await page.getByLabel('Visa filter').click();
        await calenderDays.setStartDate('2024', Months.Januari, 2);
        await calenderDays.setEndDate('2024', Months.Augusti, 20);

        await page.getByRole('button', { name: 'Spara' }).click();
        //await page.waitForTimeout(2000);

    })
    await test.step('Välj filter', async () => {
        await page.getByRole('button', { name: '2 jan. 2024 - 20 aug. 2024' }).click();
    })
});
