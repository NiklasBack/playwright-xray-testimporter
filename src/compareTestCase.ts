import type { AddedStep, DeletedStep, ModifiedStep, ModifiedTest } from './types/modifiedTest';
import type { GetTests, Step } from './types/xrayGetTestsTypes';
import type { XrayStep, XrayTestCase } from './types/xrayTypes';

export default class CompareTestCase {
  modifiedTests: ModifiedTest[] = [];
  compare(src: XrayTestCase[], remote: GetTests) {
    src.forEach((t) => {
      const tcKey = t.fields.summary.match(/([\w-]+) \|/)?.[1];
      if (tcKey !== undefined) this.getModifiedTests(tcKey, remote, t);
    });

    return this.modifiedTests;
  }

  getModifiedTests(tcKey: string | undefined, remote: GetTests, tc: XrayTestCase) {
    for (const xtc of remote.results) {
      const xrayTcKey = xtc.jira.key;
      if (tcKey === xrayTcKey) {
        const srcSummary = tc.fields.summary.replace(`${tcKey} | `, '');
        const remSummary = xtc.jira.summary;
        console.log(`found ${srcSummary}, ${remSummary}`);
        const modifiedTest = this.compareTestSteps(tc.steps, xtc.steps);
        modifiedTest.issueId = xtc.issueId;
        if (
          remSummary !== srcSummary ||
          modifiedTest.modifiedSteps.length !== 0 ||
          modifiedTest.deletedSteps.length !== 0 ||
          modifiedTest.addedSteps.length !== 0
        ) {
          if (remSummary !== srcSummary) modifiedTest.testCaseName = srcSummary;
          else modifiedTest.testCaseName = '';
          modifiedTest.tesKaseKey = tcKey;
          this.modifiedTests.push(modifiedTest);
        }
      }
    }
  }

  private compareTestSteps(srcSteps: XrayStep[], remSteps: Step[]) {
    const noSrcSteps = srcSteps.length;
    const noRemSteps = remSteps.length;
    const modifedtest: ModifiedTest = {} as ModifiedTest;
    modifedtest.addedSteps = [];
    modifedtest.deletedSteps = [];
    modifedtest.modifiedSteps = [];
    if (noSrcSteps === noRemSteps) modifedtest.modifiedSteps = this.getChangedSteps(srcSteps, remSteps, noSrcSteps);
    else if (noSrcSteps > noRemSteps) {
      modifedtest.modifiedSteps = this.getChangedSteps(srcSteps, remSteps, noRemSteps);
      modifedtest.addedSteps = this.getAddedSteps(srcSteps, noRemSteps);
    } else if (noSrcSteps < noRemSteps) {
      modifedtest.modifiedSteps = this.getChangedSteps(srcSteps, remSteps, noSrcSteps);
      modifedtest.deletedSteps = this.getDeletedSteps(remSteps, noSrcSteps);
    }
    return modifedtest;
  }

  private getChangedSteps(srcSteps: XrayStep[], remSteps: Step[], toStepNo: number) {
    const changedSteps: ModifiedStep[] = [];
    for (let i = 0; i < toStepNo; i++) {
      if (srcSteps[i].action !== remSteps[i].action) {
        console.log(`Expected: ${srcSteps[i].action} Found: ${remSteps[i].action} id: ${remSteps[i].id}`);
        changedSteps.push({
          stepId: remSteps[i].id,
          action: srcSteps[i].action,
        });
      }
    }
    return changedSteps;
  }

  private getDeletedSteps(remSteps: Step[], fromStepNo: number) {
    const stepsToDelete: DeletedStep[] = [];
    for (let i = fromStepNo; i < remSteps.length; i++) {
      console.log(`Delete step ${remSteps[i].action} id: ${remSteps[i].id}`);
      stepsToDelete.push({ stepId: remSteps[i].id });
    }
    return stepsToDelete;
  }

  private getAddedSteps(srcSteps: XrayStep[], noStepsRem: number) {
    let stepsToAdd: AddedStep[] = [];
    const stepsAdded = srcSteps.slice(noStepsRem);
    console.log(`Add steps: ${JSON.stringify(stepsAdded)}`);
    stepsToAdd = stepsAdded.map((step) => {
      return { action: step.action } as AddedStep;
    });
    return stepsToAdd;
  }
}
