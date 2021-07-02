const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (cmd) => {
  try {
    const { stdout: output } = await exec(cmd.toString())
    // if (error.includes('Command failed:')) {
    //   console.error('🚨 An error happened! Please contact the developer! ')
    // } else {
    //   console.error(err)
    // }
    // console.log(error, output)
    return { output }
  } catch (err) {
    console.error(err.message)
  }
}
