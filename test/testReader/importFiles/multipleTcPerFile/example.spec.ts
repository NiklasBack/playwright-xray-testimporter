import { test, expect } from '@playwright/test';

test('has a new title', async ({ page }) => {

  await test.step('Go to PW web page', async () => {
    await page.goto('https://playwright.dev/');
  });




  await test.step('Go click something else', async () => {
    await page.goto('https://playwright.dev/');
  });
  // await test.step('Site contains PW', async () => {
  //   // Expect a title "to contain" a substring.
  //   await expect(page).toHaveTitle(/Playwright/);
  // });


});

test('An other tc', async ({ page }) => {
  await test.step('Go to one web page', async () => {
    await page.goto('https://playwright.dev/');
  });

  await test.step('Go to another web page', async () => {
    await page.goto('https://playwright.dev/');
  });

})


