# flow-bamboo-reporter

[![License][ico-license]][link-license]
[![NPM][ico-npm]][link-npm]

A report formatter for Atlassian Bamboo, that transforms the output of the Flow static code checker to Mocha compatible JSON. This allows you to run the Flow _check_ command and display errors found nicely in Bamboo's build test pane.

## Installation
### Project local
```
npm install flow-bamboo-reporter --save-dev
```
### Global
```
npm install -g flow-bamboo-reporter
```

## Quickstart

### Generate Flow report
```
flow check --json > flow-check.json
```
### Convert the report
```
flow-bamboo-reporter -f flow-check.json
```
### Use pipes
```
flow check --json | flow-bamboo-reporter
```
### Bamboo
Add a _Mocha parser_ task to your build job, that parses the generated _mocha.json_ file.

## Options/switches
* To get an overview of the available command line options, you can invoke the command with `-h` or `--help`.
* Enable verbose output with `-v` or `--verbose`. In case you need to open an issue, this shows more information.

## Release notes

* 0.3.0
  Create passed result in case of no errors found

* 0.2.0
  Support piped input (stdin)

* 0.1.0
  Initial MVP release

[ico-license]: https://img.shields.io/github/license/hyperbrain/flow-bamboo-reporter.svg
[ico-npm]: https://img.shields.io/npm/v/flow-bamboo-reporter.svg
[link-license]: ./blob/master/LICENSE
[link-npm]: https://www.npmjs.com/package/flow-bamboo-reporter
