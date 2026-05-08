# Xray Importer/Updater for Playwright

Imports and updates Playwright test cases to Xray.

> **Note:** This is a `0.0.x` release. There may be bugs.

---

## Installation

Install the latest version:

```sh
npm install playwright-xray-testimporter
```

---

## Usage

Add a `xray.testimporter.config.json` configuration file to the root of your project.

### Configuration Options

| Option                        | Required | Description                                                                 |
|-------------------------------|----------|-----------------------------------------------------------------------------|
| `url`                         | Yes      | URL to your Jira instance                                                   |
| `type`                        | Yes      | Jira type: `cloud` or `server`                                              |
| `apiVersion`                  | No       | Xray API version: `1.0` or `2.0` (default: `2.0`)                           |
| `jiraUserName`                | Yes      | Jira username (can be empty)                                                |
| `jiraAccesToken`              | Yes      | Jira access token (can be empty)                                            |
| `client_id`                   | Yes      | Xray client ID                                                              |
| `client_secret`               | Yes      | Xray client secret                                                          |
| `projectKey`                  | Yes      | Jira project key                                                            |
| `xray_test_repository_folder` | No       | Xray folder for imported tests                                              |
| `test_input_folder`           | Yes      | Relative path to Playwright tests                                           |
| `test_output_folder`          | Yes      | Relative path for updated Playwright tests                                  |
| `max_test_cases`              | No       | Max test cases per batch (default: `100`)                                   |
| `customField`                 | No       | Set a custom field value (see Notes)                                        |

#### Example Configuration

```json
{
  "jira": {
    "url": "https://client.atlassian.net",
    "type": "cloud",
    "apiVersion": "1.0",
    "jiraUserName": "some.one@somwhere.se",
    "jiraAccesToken": ""
  },
  "cloud": {
    "client_id": "",
    "client_secret": ""
  },
  "projectKey": "TES",
  "xray_test_repository_folder": "",
  "test_input_folder": "./test/test_files_r2",
  "test_output_folder": "./test/test_files_write",
  "customField": {
    "customfield_11548": {
      "Value": "JUMP"
    }
  }
}
```

---

### Commands

- **Import Playwright tests:**
  ```sh
  npx xraytestimporter
  ```

- **Update test cases in Jira:**
  ```sh
  npx xraytestimporter --update
  ```

- **Update from Xray JSON import file:**
  ```sh
  npx xraytestimporter --file filename.json
  ```

---

## Notes

- If using `xray_test_repository_folder`, the folder must exist.
- Both `test_output_folder` and `test_input_folder` must exist before running the importer.
- The `--update` command uses `jiraAccesToken` to rename test cases in Jira.
- Updates read tests from `test_input_folder`.
- Formatting for `customField` must follow Jira conventions.

#### Custom Field Examples

**Select list (single choice):**
```json
"customField": {
  "customfield_11548": {
    "Value": "JUMP"
  }
}
```

**String field:**
```json
"customField": {
  "customfield_11548": "JUMP"
}
```

---

## License

playwright-xray-testimporter is [MIT licensed](./LICENSE).

---

## Contributors

Special thanks for supporting the project (alphabetical order):

- [sureshbalajiica](https://github.com/sureshbalajiica)

---

## Acknowledgments

- [ICA Sverige](https://www.ica.se)

---

## Author

Niklas Back <niklas.back@gmail.com>