//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';
//@ts-ignore
import { TestData } from '../test-data/testdata.ts';

test('Byt-butik', async ({ loginPage, changeStorePage }, ) => {
  //Logga in
  await loginPage.login(TestData.testUser_12740cw.userId, TestData.testPw.passWord);
  await changeStorePage.changeStore(TestData.testStore2);
  await changeStorePage.changeStore(TestData.testStore1);
});