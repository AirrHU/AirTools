const { readdirSync } = require('fs')
const { isWebUri } = require('valid-url')
const { execSync } = require('child_process')
const { prompt } = require('inquirer')
const str = require('@supercharge/strings')

module.exports = () => {
  prompt([
    {
      type: 'input',
      message: 'Please enter the URL of the repository you want to pull.',
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
            message: 'Are you sure you want to pull this repository?',
            name: 'confirmation',
          },
        ]).then(({ confirmation }) => {
          return confirmation ? (confirmed = true) : null
        })

        if (confirmed) {
          const pullOutput = execSync('git pull')
          console.log(pullOutput.toString())
        }
      } else {
        return console.log('❌️ Invalid URL.')
      }
    } else {
      return console.log('😶 This directory does not have Git initialized!')
    }
  })
}
