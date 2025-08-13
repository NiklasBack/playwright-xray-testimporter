import { test, expect } from '../Fixtures/Fixtures';


test('TES-558 | Klubb', async ({ page, gotoSite }) => {
  await test.step('Go to hemsidan', async () => {
    await gotoSite.go()

  });


  await test.step('Navigera till klubb Hjärtat', async () => {
    await page.getByRole('link', { name: 'Klubb Hjärtat' }).first().click();
  });

  await test.step('Välj Bli medlem i meny till vänster', async () => {
    await page.getByRole('link', { name: 'Bli medlem' }).click();
  });

  await test.step('Verifiera "Bli medlem i klubb Hjärtat"', async () => {
    await expect.soft(page.locator('h1')).toContainText('Bli medlem i Klubb Hjärtat');

  });
  await test.step('Välj Gemensam bonusX', async () => {
    await page.getByRole('link', { name: 'Gemensam bonusX' }).click();
  });
  await test.step('Verifiera "Gemensam bonusX"', async () => {
    await expect.soft(page.locator('h1')).toContainText('Gemensam bonus på Apotek Hjärtat ochX');

  });
  await test.step('Välj Student - och seniorrabatt', async () => {
    await page.getByRole('link', { name: 'Student - och seniorrabatt' }).click();
  });
  await test.step('Verifiera "Student - och seniorrabatt"', async () => {
    await expect.soft(page.locator('h1')).toContainText('Student - och seniorrabatt på Apotek Hjärtat ochX');

  });

  await test.step('Välj Medlemserbjudanden och samarbetspartners', async () => {
    await page.getByRole('link', { name: ' Medlemserbjudanden och samarbetspartners' }).click();
  });
  await test.step('Verifiera " Medlemserbjudanden och samarbetspartners"', async () => {
    await expect.soft(page.locator('h1')).toContainText(' Medlemserbjudanden och samarbetspartners');

  });
  await test.step('Välj Medlemsvillkor', async () => {
    await page.getByRole('link', { name: 'Medlemsvillkor' }).click();
  });

  await test.step('Verifiera "Medlemsvillkor"', async () => {
    await expect.soft(page.locator('h1')).toContainText('Medlemsvillkor');

  });



});