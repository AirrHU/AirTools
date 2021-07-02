'use strict'

const { prompt } = require('inquirer')
const { exec, spawnSync, execSync } = require('child_process')
const { readdirSync } = require('fs')
const { isWebUri } = require('valid-url')
const str = require('@supercharge/strings')
const execute = require('./utils/exec/shell')
const commit = require('./utils/git/commit')
const push = require('./utils/git/push')
const pull = require('./utils/git/pull')

const _choices = {
  'Generate a project/file': 'gen',
  GitHub: 'gh',
  'Execute shell command (not root!)': 'exec',
  Quit: 'exit',
}

const _ghActions = {
  'Commit to current repo': 'commit',
  'Push to current repo': 'push',
  'Pull current repo': 'pull',
  'Initialize Git repository in current folder': 'init',
}

const menu = [
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
]

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
    const choice = _choices[category]
    console.log(choice)

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
          // console.log(_action)
          const action = _ghActions[_action]
          switch (action) {
            case 'commit':
              const dir = readdirSync(process.cwd())
              // console.log(dir)
              if (dir.includes('.git')) {
                prompt([
                  {
                    type: 'input',
                    message: 'What do you want the commit message to be?',
                    name: 'commitMessage',
                  },
                ]).then(({ commitMessage }) => {
                  const o = commit(commitMessage, prompt)
                  // console.log(o)
                  return
                })
              } else {
                return console.log(
                  '😶 This directory does not have Git initialized!'
                )
              }
              break
            case 'init':
              prompt([
                {
                  type: 'confirm',
                  name: 'decision',
                  message:
                    'Are you sure you want to initialize a Git repository in the current directory?',
                },
              ]).then(({ decision }) => {
                const dir = readdirSync(process.cwd())
                // console.log(dir)
                if (!dir.includes('.git')) {
                  if (decision) {
                    const o = exec(`git init`)
                    return console.log(
                      `✅️ Successfully initialized Git repository in ${process
                        .cwd()
                        .split('/')
                        .pop()}.`
                    )
                  } else {
                    return console.log('✅️ Operation successfully canceled!')
                  }
                } else {
                  return console.log(
                    '👀 This directory already has Git initialized!'
                  )
                }
              })
              break
            case 'push':
              prompt([
                {
                  type: 'input',
                  message: 'Please enter the Git URL for the repository.',
                  name: 'url',
                },
                {
                  type: 'input',
                  message:
                    'Please enter the name of the branch you want to push to.',
                  name: 'branch',
                },
              ]).then(({ url, branch }) => {
                push(url, branch, prompt)
              })
              break
            case 'pull':
              prompt([
                {
                  type: 'input',
                  message:
                    'Please enter the URL of the repository you want to pull.',
                  name: 'url',
                },
              ]).then(({ url }) => {
                const dir = readdirSync(process.cwd())
                let confirmed = false
                let _str
                // console.log(dir)
                if (dir.includes('.git')) {
                  if (isWebUri(url) && url.endsWith('.git')) {
                    const status = execSync('git status')
                    if (
                      status
                        .toString()
                        .includes(
                          'no changes added to commit (use "git add" and/or "git commit -a")'
                        )
                    ) {
                      console.log(
                        str(status.toString())
                          .after(
                            '(use "git restore <file>..." to discard changes in working directory)'
                          )
                          .before(
                            'no changes added to commit (use "git add" and/or "git commit -a")'
                          )
                          .get()
                      )
                    } else {
                      console.log(
                        str(status.toString())
                          .after(
                            '(use "git restore <file>..." to discard changes in working directory)'
                          )
                          .get()
                      )
                    }
                    prompt([
                      {
                        type: 'confirm',
                        message:
                          'Are you sure you want to pull this repository?',
                        name: 'confirmation',
                      },
                    ]).then(({ confirmation }) => {
                      return confirmation ? (confirmed = true) : null
                    })

                    if (confirmed) {
                      const pullOutput = execSync('git pull')
                      console.log(pullOutput)
                    }
                  } else {
                    return console.log('❌️ Invalid URL.')
                  }
                } else {
                  return console.log(
                    '😶 This directory does not have Git initialized!'
                  )
                }
              })
              break
            default:
              return console.log('🧐 Method not implemented yet.')
          }
        })
        break

      case 'exit':
        process.exit(0)
    }
  })
} catch (err) {
  console.error(err)
}
