#!/usr/bin/env node
import gendiff from 'commander';
import { version } from '../../package.json';
import createDiff from '..';

const defaultFormat = 'pretty';

gendiff
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', `Output format[${defaultFormat}]`, [defaultFormat])
  .action((firstConfig, secondConfig) => {
    try {
      if (!defaultFormat.includes(gendiff.format)) {
        console.warn(`${gendiff.format} is not supported. Used default (${defaultFormat})`);
      }
      const result = createDiff(firstConfig, secondConfig);
      console.log(result);
    } catch (err) {
      const { errno, message } = err;
      console.error(message);
      process.exit(errno);
    }
  })
  .parse(process.argv);
