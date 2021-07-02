const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = (msg, prompt) => {
  try {
    if (msg && typeof msg === 'string') {
      prompt([
        {
          type: 'confirm',
          name: 'decision',
          message: 'Are you sure you want to make this commit?',
        },
      ]).then(({ decision }) => {
        if (decision) {
          const { stdout } = exec('git add .')
          const { stdout: output } = exec(`git commit -m "${msg.toString()}"`)

          return output && stdout ? { output, stdout } : null
        } else {
          return console.log('✅️ Operation successfully canceled!')
        }
      })
    } else {
      console.error(`🥞 The commit message must be a string!`)
    }
  } catch (err) {
    console.error(err)
  }
}
