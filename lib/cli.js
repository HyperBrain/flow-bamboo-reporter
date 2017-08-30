'use strict';
/**
 * flow-bamboo-reporter
 * Converts JSON output from 'flow check --json' to Atlassian Mocha result parser
 * compatible JSON.
 */

const _ = require('lodash');
const BbPromise = require('bluebird');
const minimist = require('minimist');
const chalk = require('chalk');
const log = console.log;
const fs = require('fs');

const convert = require('./convert');

const args = minimist(process.argv.slice(2), {
  alias: {
    f: 'file',
    o: 'out',
    h: 'help',
    n: 'no-color',
    v: 'verbose'
  },
  boolean: [
    'h',
    'v'
  ]
});

/**
 * Argument checking
 */
if (args.help || !_.isString(args.f) || _.isEmpty(args.f)) {
  log('====================');
  log('flow-bamboo-reporter');
  log('====================');
  log('Options:');
  log('  -f | --file        Input filename');
  log('  -o | --out         Output filename (default: mocha.json)');
  log('  -n | --no-color    Disable colors');
  log('  -v | --verbose     Verbose logs');
  log('  -h | --help        Show this help');
  process.exit(0);
}

/**
 * Disable colors
 */
if (args.n) {
  chalk.enabled = false;
}

const outFile = args.o || 'mocha.json';

/**
 * Check for the JSON input file
 */
BbPromise.fromCallback(cb => {
  fs.readFile(args.f, 'utf8', cb);
})
.then(jsonData => BbPromise.try(() => JSON.parse(jsonData)))
.then(flowJson => convert(flowJson, args))
.then(mochaJson => BbPromise.fromCallback(cb => {
  fs.writeFile(outFile, JSON.stringify(mochaJson), 'utf8', cb);
}))
.catch(err => {
  log(chalk.red(`${err.toString()}`));
  process.exitCode = 1;
});
