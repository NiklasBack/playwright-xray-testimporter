#!/usr/bin/env node
import TestImporter from './testimporter';
import TestUpdater from './testUpdater';

const task = process.argv[2];
switch (task) {
  case undefined:
  case '--import': {
    console.log(`Will now import test cases to Xray`);
    const testImport = new TestImporter();
    testImport.importTestCases();
    break;
  }
  case '--update': {
    console.log(`Will now update test cases in Xray`);
    const testUpdate = new TestUpdater();
    testUpdate.updateXray();
    break;
  }
  case '--file': {
    if (process.argv[3] === undefined) console.log(`Please specify import file`);
    console.log(`Will now update test cases in Xray based on ${process.argv[3]}`);

    const testUpdateFile = new TestUpdater();
    testUpdateFile.updateXray(process.argv[3]);

    break;
  }
  default:
    console.log(`Unkown command ${task}`);
    break;
}
