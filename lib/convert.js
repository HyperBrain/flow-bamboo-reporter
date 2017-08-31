'use strict';
/**
 * Convert the JSON.
 */

const _ = require('lodash');
const BbPromise = require('bluebird');
const chalk = require('chalk');
const path = require('path');
const log = console.log;
const error = console.error;

function encode(str) {
  if (!str) {
    return '';
  }

  var pair;
  var string = str;
  // Taken from jshint-reporter-bamboo
  var pairs = {
    '&:': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    '\t': '',
  };

  for (pair in pairs) {
    if (typeof (string) !== 'undefined') {
      string = string.replace(new RegExp(pair, 'g'), pairs[pair]);
    }
  }
  return string || '';
}

module.exports = function(flowJson, args) {
  if (!_.has(flowJson, 'flowVersion')) {
    return BbPromise.reject(new Error('Invalid JSON'));
  }

  args.v && log(`Processing input from flow v${flowJson.flowVersion}`);

  const mochaOutput = {
    stats: {
      tests: 0,
      passes: 0,
      failures: 0,
      duration: 0,
      start: new Date(),
      end: new Date(),
    },
    failures: [],
    passes: [],
    skipped: [],
  };

  _.forEach(flowJson.errors, flowError => {
    mochaOutput.stats.tests++;
    mochaOutput.stats.failures++;

    const errorCount = _.size(flowError.message);
    if (errorCount > 0) {
      const location = _.get(_.first(flowError.message), 'loc', {});
      const filename = _.get(location, 'source', 'unknown');
      const messages = _.join(_.compact(_.map(flowError.message, message => {
        const context = message.context;
        const description = message.descr;
        const start = message.start;
        const end = message.end;
        let outMessage = null;

        if (message.type === 'Blame') {
          const target = context.substr(start - 1, end - (start - 1));
          const split = _.split(context, target);
          outMessage = split[0] + '--[' + target + ']--' + _.join(_.tail(split), '');
        } else if (message.type === 'Comment') {
          outMessage = description;
        }

        return encode(outMessage);
      })), '\n');

      const mochaError = {
        title: `${path.basename(filename)}:${_.get(location, 'start.line')}`,
        fullTitle: filename,
        duration: 0,
        errorCount,
        error: messages
      };

      args.v && log(chalk.yellow(messages));

      mochaOutput.failures.push(mochaError);
    }
  });

  if (_.isEmpty(mochaOutput.failures) && _.isEmpty(mochaOutput.passes) && _.isEmpty(mochaOutput.skipped)) {
    mochaOutput.stats.passes = 1;
    mochaOutput.passes.push({
      title: 'Flow checks passed',
      fullTitle: 'No errors detected',
      duration: 0,
      errorCount: 0
    });
  }

  return BbPromise.resolve(mochaOutput);
};
