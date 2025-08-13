//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('sortiment_Prisuppdateringar_Avvikande-Priser_Filtrera_PIB', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in', async () => {
    await loginPage.login(TestData.testUser_12740cc.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore2);
  })

  await test.step('Gå till Prisuppdateringar', async () => {
    await page.getByRole('button', { name: 'APPAR' }).click();
    await page.getByRole('link', { name: 'Sortiment', exact: true }).click();
    //getByRole('heading', { name: 'Artiklar' })
    if (process.env.isMobile?.includes('true'))  {
      await page.getByText('Meny Sortiment').isEnabled({ timeout: 20000 });
      await page.getByText('Prisuppdateringar').click();
    } else {
      await page.getByRole('heading', { name: 'Artiklar' }).isEnabled({ timeout: 20000 });
      if (await page.getByLabel('Fler menyalternativ').isEnabled())
        await page.getByLabel('Fler menyalternativ').click()
      await page.getByLabel('Prisuppdateringar').click();
    }
  })

  await test.step('Verifiera filter inom Ohanterad', async () => {
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Se artiklar med avvikande' }).first().click();
    await page.waitForTimeout(1000);
    await page.getByText('Artiklar i butiksplock').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Visa filter').click();
    await page.waitForTimeout(1000);
    await page.getByText('Artikelurval').click();
    await page.waitForTimeout(1000);
    await page.getByRole('checkbox', { name: 'Kolonial' }).check();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Filtrera' }).first().click();
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^Prislås$/ }).click();
    await page.waitForTimeout(1000);
    await page.getByText('Olåsta och låsta priser').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Artiklar som ska följa e-').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Artiklar som ska följa e-').click(); //klicka ur igen
    await page.waitForTimeout(1000);
    await page.getByLabel('Artiklar som ska följa butikspris/butikspris med påslag').click(); //klicka ur i praktiken
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.waitForTimeout(10000);
    //Byt mot "första träffen" nedan:
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('bob-x-card-row').first().locator('button').first().click();
    } else
      await page.locator('tr').nth(1).locator('.xCheckbox__input').check();
    await page.waitForTimeout(1000);
  })

  await test.step('Hantera så kan verifiera Hanterad-filtret', async () => {
    await page.getByRole('button', { name: 'Hantera 1 artikel' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('textbox').fill('23');
    await page.waitForTimeout(1000);
    await page.getByLabel('', { exact: true }).check(); //Lås pris... osynlig label? går skippa annars
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Publicera priser' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Publicera nu' }).click();
    await page.waitForTimeout(1000);
  })

  await test.step('Hanterad', async () => {
    await page.getByLabel('Visa filter').click();
    await page.waitForTimeout(1000);
    await page.getByLabel('Hanterade avvikelser', { exact: true }).check();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Filtrera' }).click();
    await page.waitForTimeout(10000);
    //Byt till samma artikel som ovan, "första träffen"
    if (process.env.isMobile?.includes('true'))  {
      await page.locator('bob-x-card-row').first().locator('button').first().click();
    } else
      await page.locator('tr').nth(1).locator('.xCheckbox__input').check();
  })
});