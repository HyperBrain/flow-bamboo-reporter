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
### Bamboo
Add a _Mocha parser_ task to your build job, that parses the generated _mocha.json_ file.

## Options/switches
To get an overview of the available command line options, you can invoke the command with `-h` or `--help`.

[ico-license]: https://img.shields.io/github/license/hyperbrain/flow-bamboo-reporter.svg
[ico-npm]: https://img.shields.io/npm/v/flow-bamboo-reporter.svg
