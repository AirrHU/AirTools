'use strict';
const { prompt } = require('inquirer');
const { readdirSync } = require('fs');
const { exec } = require('child_process');
const execute = require('./utils/exec/shell');
const { commit } = require('./utils/git/commit');
const { push } = require('./utils/git/push');
const { pull } = require('./utils/git/pull');
const { Manager } = require('./Manager');
const _choices = {
    'Generate a project/file\n': 'gen',
    GitHub: 'gh',
    'Execute shell command (not root!)': 'exec',
    Quit: 'exit',
};
const _ghActions = {
    'Commit to current repo': 'commit',
    'Push to current repo': 'push',
    'Pull current repo': 'pull',
    'Initialize Git repository in current folder': 'init',
};
const languages = {
    JavaScript: 'js',
    TypeScript: 'ts',
    'Python (coming soon..)': 'py',
};
const packageManagers = {
    NPM: 'npm',
    'Yarn (recommended)': 'yarn',
};
try {
    prompt([
        {
            type: 'list',
            name: 'category',
            message: 'Select a category!',
            choices: [
                'GitHub',
                'Execute shell command (not root!)',
                'Generate a project/file\n',
                'Quit',
            ],
        },
    ]).then(({ category }) => {
        const choice = _choices[category];
        switch (choice) {
            case 'gh':
                prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'Select action!',
                        choices: [
                            'Initialize Git repository in current folder',
                            'Commit to current repo',
                            'Push to current repo',
                            'Pull current repo',
                        ],
                    },
                ]).then(({ action: _action }) => {
                    const action = _ghActions[_action];
                    switch (action) {
                        case 'commit':
                            const dir = readdirSync(process.cwd());
                            if (dir.includes('.git')) {
                                prompt([
                                    {
                                        type: 'input',
                                        message: 'What do you want the commit message to be?',
                                        name: 'commitMessage',
                                    },
                                ]).then(({ commitMessage }) => {
                                    const o = commit(commitMessage, prompt);
                                    return;
                                });
                            }
                            else {
                                return console.log('😶 This directory does not have Git initialized!');
                            }
                            break;
                        case 'init':
                            prompt([
                                {
                                    type: 'confirm',
                                    name: 'decision',
                                    message: 'Are you sure you want to initialize a Git repository in the current directory?',
                                },
                            ]).then(({ decision }) => {
                                const dir = readdirSync(process.cwd());
                                if (!dir.includes('.git')) {
                                    if (decision) {
                                        const o = exec(`git init`);
                                        return console.log(`✅️ Successfully initialized Git repository in ${process
                                            .cwd()
                                            .split('/')
                                            .pop()}.`);
                                    }
                                    else {
                                        return console.log('✅️ Operation successfully canceled!');
                                    }
                                }
                                else {
                                    return console.log('👀 This directory already has Git initialized!');
                                }
                            });
                            break;
                        case 'push':
                            prompt([
                                {
                                    type: 'input',
                                    message: 'Please enter the Git URL for the repository.',
                                    name: 'url',
                                },
                                {
                                    type: 'input',
                                    message: 'Please enter the name of the branch you want to push to.',
                                    name: 'branch',
                                },
                            ]).then(({ url, branch }) => {
                                push(url, branch, prompt);
                            });
                            break;
                        case 'pull':
                            pull();
                            break;
                        default:
                            return console.log('🧐 Method not implemented yet.');
                    }
                });
                break;
            case 'gen':
                prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Enter your project name',
                    },
                    {
                        type: 'list',
                        name: 'language',
                        message: 'Choose the language you want to write your project in',
                        choices: ['JavaScript', 'TypeScript', 'Python (coming soon..)'],
                    },
                    {
                        type: 'list',
                        name: 'pkgmanager',
                        message: 'Select the package manager you want to use!',
                        choices: ['NPM', 'Yarn (recommended)'],
                    },
                ]).then(({ language, name, pkgmanager }) => {
                    const _language = languages[language];
                    const _pkgmanager = packageManagers[pkgmanager];
                    new Manager().init(name, _language, _pkgmanager);
                });
                break;
            case 'exit':
                process.exit(0);
        }
    });
}
catch (err) {
    console.error(err);
}
//# sourceMappingURL=main.js.map