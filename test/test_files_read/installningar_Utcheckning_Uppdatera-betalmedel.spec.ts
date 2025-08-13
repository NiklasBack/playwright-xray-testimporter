//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Installningar - Utcheckning. Uppdatera betalmedel', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cp.userId, TestData.testPw.passWord);

  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);

    //await page.getByRole('button', { name: 'APPAR' }).click();
    //await page.getByRole('link', { name: 'Sortiment', exact: true }).click();


  })
  await test.step('Sök betalmedel', async () => {
    await page.goto('/installningar/utcheckning');
    await page.getByRole('link', { name: /Betalmedel/ }).click();

    await page.getByPlaceholder('Sök betalmedel').fill('EgetX-presentkort');

  })
  await test.step('Aktivera/inaktivera betalmedel', async () => {
    await page.getByText('EgetX-presentkort').click();
    await page.locator('pos-x-input-switch[data-test="input-switch"]').click();

  })
  await test.step('Ändra maxgräns per kvitto', async () => {
    await page.locator('#internal-edit-tender-max-value-input').clear();
    await page.locator('#internal-edit-tender-max-value-input').fill('98765');

  })
  await test.step('Skriv egen kvittotext', async () => {
    //await page.locator('pos-x-input[data-test="display-name-input"]').clear();
    await page.locator('pos-x-input[data-test="display-name-input"]').locator('.xInput__input').fill('Egen kvittotext');

    await page.locator('#save-btn').click();

  })

});

