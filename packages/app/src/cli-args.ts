import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

export const readCLiArgs = () => {
  yargs(process.argv).argv;
  return yargs(hideBin(process.argv))
    .options({
      file: {
        alias: 'f',
        describe: 'Read directly from file instead of stdin',
        type: 'string',
      },
    })
    .parseSync();
};
