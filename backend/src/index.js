import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';


import initRepo from './controllers/init.js';
import addRepo from './controllers/add.js';
import commitRepo from './controllers/commit.js';
import pushRepo from './controllers/push.js';
import pullRepo from './controllers/pull.js';
import revertRepo from './controllers/revert.js';

yargs(hideBin(process.argv))
    .command(
        "init",
        "Initialize a new repository",
        {},
        initRepo
    )
    .command(
        "add <file>",
        "Add a file to staged",
        (yargs) => {
            yargs.positional('file', {
                describe: 'File to add',
                type: 'string'
            });
        },
        (argv) => {
            addRepo(argv.file);
        }
    )
    .command(
        "commit <msg>",
        "Commit the staged files",
        (yargs) => {
            yargs.positional('msg', {
                describe: 'commit message',
                type: 'string'
            });
        },
        (argv) => {
            commitRepo(argv.msg);
        }
    )
    .command(
        "push",
        "Push the committed changes",
        {},
        pushRepo
    )
    .command(
        "pull",
        "Pull the latest changes",
        {},
        pullRepo
    )
    .command(
        "revert <commitID>",
        "Revert to a specific commit",
        (yargs) => {
            yargs.positional('commitID', {
                describe: 'Commit ID to revert to',
                type: 'string'
            });
        },
        (argv) => {
            revertRepo(argv.commitID);
        }
    )
    .demandCommand(1, 'You need at least one command!')
    .help().argv;