export interface ModifiedTest {
  issueId: string;
  testCaseName: string;
  tesKaseKey: string;
  modifiedSteps: ModifiedStep[];
  addedSteps: AddedStep[];
  deletedSteps: DeletedStep[];
}

export interface DeletedStep {
  stepId: string;
}

export interface AddedStep {
  action: string;
}

export interface ModifiedStep {
  stepId: string;
  action: string;
}
