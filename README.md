# Xray importer/ updater for Playwright

Imports and updates Playwright test cases to Xray

## Install
Install the latest version with
```sh
npm install playwright-xray-testimporter 
```

## Usage

Add the `xray.testimporter.config.json` configuration file to the root of your project. 

* `url` Mandatory, URL to your Jira
* `type` Mandatory, Jira is in the cloud or on your server
* `apiVersion`Optional, use Xray API version 1.0 or 2.0 (default)
* `jiraUserName` Mandatory (can be empty), Used to update test cases in Jira
* `jiraAccesToken` Mandatory (can be empty), Used to update test cases in Jira
* `client_id` Mandatory, Xray client id 
* `client_secret` Mandatory, Xray client secret
* `projectKey` Mandatory, Project key to the Jira project
* `xray_test_repository_folder` Optional, Xray folder to place the imported tests into
* `test_input_folder` Mandatory, Relative path to the Playwright tests
* `test_output_folder` Mandatory, Relative path to where the updated Playwright tests should be placed
* `max_test_cases` Optional, defaults to 100. Importing a lot of test cases can take a while, so better do it in batches.
* `customField` Optional. Will set a cutom field to a value. The content of customField must be correctly formatted, see Notes

```typescript
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

To start the import, type the command below in terminal:

```sh
npx xraytestimporter
```

To start the update, type the command below in terminal:

```sh
npx xraytestimporter --update
```

To update from a Xray Json import file

```sh
npx xraytestimporter --file filename.json
```

## Notes
* If the folder option `xray_test_repository_folder` is used, the folder has to exist
* The `test_output_folder`and `test_input_folder` must exist before running he testimporter
* The `--update` uses `jiraAccesToken` to rename the test cases in Jira
* When running update, the updater reads the tests from `test_input_folder` 
* Formating of customField must follow the Jira format, e.g. a select list, single choice would look like this.

```typescript
"customField": {
    "customfield_11548": {
            "Value": "JUMP"
        }
}
```

A string field would look like this

```typescript
"customField": {
    "customfield_11548": "JUMP"
}
```

## License

playwright-xray-testimporter is [MIT licensed](./LICENSE).

## Contributors (special thanks for supporting the project), in alphabetical order:
- [sureshbalajiica](https://github.com/sureshbalajiica)

## Acknowledgments

* [ICA Sverige](https://www.ica.se)


## Author

Niklas Back <niklas.back@gmail.com>
