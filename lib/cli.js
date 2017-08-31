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
const fs = require('fs');
const log = console.log;
const error = console.error;

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
    'v',
    'n'
  ]
});

/**
 * Argument checking
 */
if (args.help) {
  log('====================');
  log('flow-bamboo-reporter');
  log('====================');
  log('Options:');
  log('  -f | --file        Input filename (default: stdin)');
  log('  -o | --out         Output filename (default: mocha.json)');
  log('  -n | --no-color    Disable console colors');
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

/**
 * Set output file.
 */
const outFile = args.o || 'mocha.json';
args.v && log(chalk.white(`Using output file ${outFile}`));

/**
 * Set input file.
 */
let readPromise;
if (!args.f) {
  args.v && log(chalk.white('Using stdin'));
  process.stdin.setEncoding('utf8');
  readPromise = new BbPromise((resolve, reject) => {
    let content = '';

    process.stdin.on('readable', () => {
      const chunk = process.stdin.read();
      if (chunk !== null) {
        content += chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(content);
    });

    process.stdin.on('error', err => {
      reject(err);
    });
  });
} else {
  args.v && log(chalk.white(`Using input file ${args.f}`));
  readPromise = BbPromise.fromCallback(cb => {
    fs.readFile(args.f, 'utf8', cb);
  });
}

/**
 * Check for the JSON input file
 */
readPromise
.then(jsonData => BbPromise.try(() => JSON.parse(jsonData)))
.then(flowJson => convert(flowJson, args))
.then(mochaJson => BbPromise.fromCallback(cb => {
  fs.writeFile(outFile, JSON.stringify(mochaJson), 'utf8', cb);
}))
.catch(err => {
  error(chalk.red(`${err.toString()}`));
  process.exitCode = 1;
});
