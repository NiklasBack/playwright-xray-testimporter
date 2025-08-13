//@ts-ignore
import { TestData } from '../test-data/testdata.ts';
//@ts-ignore
import { test } from '../fixtures/set-mobile-desktop.ts';

test('Logga-in', async ({ page, loginPage }) => {
  await loginPage.login(TestData.testUser_12740cw.userId, TestData.testPw.passWord);
 });
