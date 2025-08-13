// Kolla upp

import { fakerSV } from '@faker-js/faker';
//@ts-ignore
import { expect, test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';


test('Installningar_Omraden_Skapa-redigera-ta-bort-omrade', async ({ page, loginPage, changeStorePage }) => {


  await test.step('Logga in med användare och lösenord', async () => {
    await loginPage.login(TestData.testUser_12740cn.userId, TestData.testPw.passWord);
  })

  await test.step('Byt butik/stanna i vald butik', async () => {
    await changeStorePage.changeStore(TestData.testStore1);  //demo testbutik
  })

  await page.getByRole('button', { name: 'APPAR' }).click();
  await page.locator('mb-x-overlay').getByRole('link', { name: 'Inställningar' }).click();

  if (process.env.isMobile?.includes('true'))  {
    await page.getByRole('heading', { name: 'Sortiment' }).isEnabled({ timeout: 20000 });
    await page.getByRole('button', { name: 'Område' }).click({ timeout: 15000 });
  } else {
    await page.getByLabel('Område').click();
  }

  const uid = fakerSV.string.uuid();
  await test.step('Skapa område', async () => {
    await page.waitForTimeout(5000);
    if (await page.getByText('Uppdaterade behörigheter').isVisible())
      await page.locator('[data-test="confirm-missing-permission-button"]').getByRole('button', { name: 'Stäng' }).click();

    await page.getByRole('button', { name: 'Skapa nytt' }).first().click({ timeout: 15000 });

    await page.getByLabel('Ange namn *').fill(uid);
    await page.locator('bs-x-dialog').getByRole('button', { name: 'Skapa nytt område' }).click();
  })

  await test.step('Ändra område (första i listan)', async () => {
    //TODO: search for exact match, right now Autotest just happen to be first in chronological order
    await page.getByRole('button', { name: uid }).first().scrollIntoViewIfNeeded();

    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: uid }).locator('bs-x-icon-chevron').click();
      await page.getByRole('button', { name: 'Säljplatser' }).locator('bs-x-icon-chevron').click();
    }
    else {
      await page.getByRole('button', { name: uid }).first().click();
    }
  })
  
  //await mbHelpers.click(testName, 'shadow/ .xElementsTable--action-icon', "Första Området I Listan") //Förhoppningsvis Autotest
  await test.step('Första Området I Listan', async () => {
    await page.locator('bs-x-card-row bs-x-checkbox').first().click(); // Första Checkboxen
  })

  //TODO: select exaxt checkbox with id later
  //await mbHelpers.click(testName, 'shadow/ .xCheckbox__input', "Första Checkboxen") //Check
  await test.step('Första Checkboxen', async () => {
    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: 'Klar' }).click();
    }
    await page.getByRole('button', { name: 'Spara' }).click();


    if (process.env.isMobile?.includes('true'))  {

      await page.getByRole('button', { name: 'Säljplatser' }).locator('bs-x-icon-chevron').click();
    }

    await page.locator('bs-x-card-row bs-x-checkbox').first().click(); // Första Checkboxen
    //TODO: select exaxt checkbox with id later
    //await mbHelpers.click(testName, 'shadow/ .xCheckbox__input', "Första Checkboxen") //Check

    if (process.env.isMobile?.includes('true'))  {
      await page.getByRole('button', { name: 'Klar' }).click();
    }
    await page.getByRole('button', { name: 'Spara' }).click();
  })
});
