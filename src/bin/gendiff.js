#!/usr/bin/env node
import gendiff from 'commander';
import { version } from '../../package.json';

gendiff
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
