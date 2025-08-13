
import {test, expect} from '@playwright/test'

test('Login to the-internet.herokuapp.com', async ({ loginPage, page }) => {

  test.step('Gå till HerokuApp', async () => {
    await page.goto('https://the-internet.herokuapp.com/');
    await page.getByRole('link', { name: 'Form Authentication' }).click();
  });

  await test.step('Logga in', async () => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: ' Login' }).click();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });

  await test.step('Logga ut', async () => {
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
  });

});

test('Min butik', async ({ page, loginPage }) => {
  await page.goto('https://xyz.shop.se/sign-in?returnUrl=%2F');
  await page.getByRole('link', { name: 'Logga in' }).click();
  await page.getByLabel('Användarnamn eller mejladress').click();
  await page.getByLabel('Användarnamn eller mejladress').fill('12740s');
  await page.getByLabel('Lösenord').click();
  await page.getByLabel('Lösenord').fill('Bubbla2022!');
  await page.getByRole('button', { name: 'Logga in' }).click();
  await page.goto('https://xyz.shop.se/overview/');
});
