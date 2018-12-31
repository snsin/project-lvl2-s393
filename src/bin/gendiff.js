#!/usr/bin/env node
import gendiff from 'commander';
import { version } from '../../package.json';
import plainJson from '..';

gendiff
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    try {
      const result = plainJson(firstConfig, secondConfig);
      console.log(result);
    } catch (err) {
      const { errno, message } = err;
      console.error(message);
      process.exit(errno);
    }
  })
  .parse(process.argv);
