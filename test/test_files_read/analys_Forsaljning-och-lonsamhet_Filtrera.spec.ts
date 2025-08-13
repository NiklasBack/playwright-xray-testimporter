import { Response } from '@playwright/test';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Analys - Forsaljning och lonsamhet filtrera',
  async ({ page, loginPage, changeStorePage }) => {

    await test.step('Logga in med användare och lösenord', async () => {
      await loginPage.login(TestData.testUser_12740de.userId, TestData.testPw.passWord);
    });

    await test.step('Byt butik/stanna i vald butik', async () => {
      await changeStorePage.changeStore(TestData.testStore1) //demo testbutik
    });

    await test.step('Gå till sidan', async () => {
      await page.getByRole('button', { name: 'APPAR' }).click();
      await page.getByRole('link', { name: 'Analys', exact: true }).click();
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
        await page.locator('mb-x-segment').getByText('Försäljning & kundfrekvens').click({ timeout: 15000 });
      } else {
        await page.getByRole('heading', { name: 'Försäljning & kundfrekvens' }).isEnabled({ timeout: 20000 });
        await page.getByLabel('Försäljning & lönsamhet').click();
      }
    });

    await test.step('Filtrera övriga utcheckningstyper', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByRole('radio', { name: 'Butik' }).check();
      await page.getByRole('radio', { name: 'Övriga utcheckningstyper' }).check();
      await page.getByLabel('Inkl. Ej försäljning').click();
      await page.getByText('Inkl. moms').click();
      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});

    });

    await test.step('Filtrera endast mobil självscanning', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByRole('radio', { name: 'Butik' }).check();
      await page.getByRole('radio', { name: 'Endast Mobil Självscanning' }).check();
      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});

    });

    await test.step('Filtrera avdelningar', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByText('Urval').click(); //Replace to avoid not being unique. OR adding Hantera nyckeltal and uncheck PTAT & FPAT as precondtion of test
      await page.locator('div').filter({ hasText: /^Avdelningar$/ }).click();
      await page.getByText('Avdelning', { exact: true }).click();
      await expect(page.locator('bob-x-segment').filter({ hasText: 'Alla' }).getByLabel('')).toBeChecked();
      await page.locator('bob-x-button').first().click();
      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
    });

    await test.step('Filtrera kategorier', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByText('Urval').click();
      await page.locator('div').filter({ hasText: /^Kategorier$/ }).click();
      await page.getByText('Kategori', { exact: true }).click();
      await page.locator('bob-x-segment').filter({ hasText: 'Alla' }).getByLabel('').check();
      await page.getByRole('button', { name: 'Klar' }).click();
      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });

      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
    });

    await test.step('Filtrera huvudkategorier', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByText('Urval').click();
      await page.locator('div').filter({ hasText: /^Huvudkategori$/ }).click();
      await page.getByText('Huvudkategori').nth(2).click();
      await page.getByRole('checkbox', { name: '1 - Kolonial' }).check();
      await page.getByRole('checkbox', { name: '2 - Färskvaror' }).check();
      await page.getByRole('checkbox', { name: '3 - Frukt, grönt & blommor' }).check();
      await page.getByRole('checkbox', { name: '4 - Nearfood' }).check();
      await page.getByRole('checkbox', { name: '7 - Returemballage & administrativa artiklar' }).check();
      await page.getByRole('checkbox', { name: '8 - Butiks egna kategorier' }).check();
      await page.getByRole('checkbox', { name: '9 - Special' }).check();
      await page.getByRole('button', { name: 'Klar' }).click();
      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});

    });

    await test.step('Filtrera artiklar', async () => {

      await page.getByLabel('Visa filter').click();
      await page.getByRole('button', { name: 'Urval Huvudkategori' }).locator('bob-x-icon-chevron').click();
      await page.locator('div').filter({ hasText: /^Artiklar$/ }).click();
      await page.getByText(/Artiklar.*[0-9] artiklar/).click();
      //await page.waitForTimeout(5000);
      await page.locator('#internal-bobArticleSearchForm__input').fill(TestData.testArticle7311311016417.ean); //error. why?
      await page.locator('bob-x-card-row').filter({ hasText: TestData.testArticle7311311016417.name }).locator('bob-x-icon-plus-circle svg').click({ timeout: 20000 });
      await page.getByRole('button', { name: 'Totalt 1 artikel' }).click();

      if (process.env.isMobile?.includes('true')) 
        await page.locator('bob-x-header').filter({ hasText: 'Artiklar' }).getByLabel('Tillbaka').click();
      else
        await page.getByLabel('Tillbaka').click();

      await page.getByRole('button', { name: 'Filtrera' }).click();
      await page.waitForResponse(async (response) => await isFinished(response, 'indicator'), { timeout: 30000 });
      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});

    });

    await test.step('Filtrera planogram. TO DO!', async () => {
      //to do
    });

    await test.step('Rensa de som går (kräver de satts ovan innan)', async () => {

      await page.locator('bob-x-tag').filter({ hasText: 'Moms' }).locator('svg').click();
      await page.getByLabel('Ta bort filter').locator('svg').click();

      if (process.env.isMobile?.includes('true'))  {
        await page.getByRole('button', { name: 'Försäljning' }).locator('bob-x-icon-chevron').click();
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
        await page.getByLabel('Tillbaka').click();
      } else
        await page.getByRole('cell', { name: 'Snitt/dag' }).locator('div').nth(1).click({timeout:20000});
    })
  });
  
async function isFinished(response: Response, text: string) {
  return response.url().includes('INDICATOR_QUERY') && response.status() === 200 && (await response.text()).includes(text)
}

