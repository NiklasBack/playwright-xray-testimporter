import { test, expect } from '@playwright/test';

test('TES-667 | has title', async ({ page }) => {
  await test.step("Go to page", async () => {
    await page.goto('https://playwright.dev/');

  });

  await test.step("Has a title", async () => {
    await expect(page).toHaveTitle(/Playwright/);

  });
});

test('TES-668 | get started link', async ({ page }) => {

  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


test('A new test for get started link', async ({ page }) => {

  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});