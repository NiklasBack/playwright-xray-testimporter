import { fakerSV } from '@faker-js/faker'
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Installningar_Utcheckning_Uppdatera_kvittolayout_logga', async ({ page, loginPage, changeStorePage }) => {

  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cp.userId, TestData.testPw.passWord);

  })
  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);  //demo testbutik
  })

  await page.getByRole('button', { name: 'APPAR' }).click();
  await page.locator('mb-x-overlay').getByRole('link', { name: 'Inställningar' }).click();

  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('heading', { name: 'Sortiment' }).isEnabled({ timeout: 20000 });
    await page.getByRole('button', { name: 'Utcheckning' }).click({ timeout: 15000 });
    await page.getByRole('link', { name: 'Kvitto' }).locator('pos-x-icon-chevron').click();
  } else {
    await page.getByLabel('Utcheckning').click({ timeout: 15000 });
    await page.getByRole('link', { name: 'Kvitto' }).click();
  }
  
  //await page.waitForTimeout(2000);
  const header = fakerSV.lorem.sentence({min:2,max:5})
  const footer = fakerSV.lorem.sentence({min:2,max:5})
  console.log(`Header ${header}, footer ${footer}`)
  await test.step(`Sätt sidhuvud ${header} och sidfot ${footer}`, async () => {
    await page.getByLabel('Visa logotyp').uncheck();
    //await page.waitForTimeout(2000);
    await page.locator('[data-test="header-editor"] div').first().fill(header);
    await page.waitForTimeout(2000);
    await page.locator('[data-test="footer-editor"]').getByRole('paragraph').fill(footer);
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Publicera ändringar' }).click();
  })
  
  await test.step('Ändra sidhuvud och sidfot', async () => {
    await page.getByLabel('Visa logotyp').check();
    await page.waitForTimeout(2000);
    await page.locator('[data-test="header-editor"]').getByText(header).fill('Sidhuvud 2');
    await page.waitForTimeout(2000);
    await page.locator('[data-test="footer-editor"]').getByRole('paragraph').fill('Sidfot 2');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Publicera ändringar' }).click();
  })
  //await page.waitForTimeout(2000);
  await test.step('Verifiera sidhuvud och sidfot', async () => {
    await expect(page.locator('[data-test="header-editor"] div').first()).toContainText('Sidhuvud 2');
    await expect(page.locator('[data-test="footer-editor"]')).toContainText('Sidfot 2');
  })
})