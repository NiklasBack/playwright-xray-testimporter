import type { Fields, XrayStep, XrayTestCase } from './types/xrayTypes';

export class XRayTest implements XrayTestCase {
  testtype: string = '';
  xray_test_repository_folder: string = '';
  fields!: Field;
  steps!: XrayStep[];
}

class Field implements Fields {
  summary: string = '';
  project!: { key: string };
}
