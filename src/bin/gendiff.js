#!/usr/bin/env node
import gendiff from 'commander';
import { version } from '../../package.json';
import createDiff from '..';
import { defaultRenderer, rendererSelector } from '../renderers';

const list = Object.keys(rendererSelector).join('|');

gendiff
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', `Output format[${list}]`, `${defaultRenderer}`)
  .action((firstConfig, secondConfig) => {
    try {
      if (!list.includes(gendiff.format)) {
        console.warn(`${gendiff.format} is not supported. Used default (${defaultRenderer})`);
      }
      const result = createDiff(firstConfig, secondConfig, gendiff.format);
      console.log(result);
    } catch (err) {
      const { errno, message } = err;
      console.error(message);
      process.exit(errno);
    }
  })
  .parse(process.argv);
