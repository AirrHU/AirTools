import util from 'util'
const exec = util.promisify(require('child_process').exec)

export default async (cmd: string) => {
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
    return
  }
}
