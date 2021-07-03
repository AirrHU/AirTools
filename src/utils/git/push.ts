import { readdirSync } from 'fs'
import { PromptModule } from 'inquirer'
import { isWebUri } from 'valid-url'
import util from 'util'
const exec = util.promisify(require('child_process').exec)

export const push = (url: string, branch: string, prompt: PromptModule) => {
  try {
    if (isWebUri(url) && url.endsWith('.git')) {
      prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: `Are you sure you want to make push to branch ${branch} ?\n ! If you get "fatal: 'origin' does not appear to be a git repository", make sure that you have global user config set up in Git (https://linuxize.com/post/how-to-configure-git-username-and-email/). `,
        },
      ]).then(({ decision }) => {
        if (decision) {
          const _dir = readdirSync(process.cwd())
          // console.log(dir)
          if (_dir.includes('.git')) {
            const dir = readdirSync(`${process.cwd()}/.git/refs/remotes/`)
            if (!dir.includes('origin')) {
              exec(`git remote add origin ${url}`)
            }
            exec(`git push origin ${branch}`)

            // return output && stdout ? { output, stdout } : null
          } else {
            return console.log(
              '😶 This directory does not have Git initialized!'
            )
          }
        } else {
          return console.log('✅️ Operation successfully canceled!')
        }
      })
    } else {
      return console.log('❌️ Invalid URL.')
    }
  } catch (err) {
    console.error(err)
  }
}
