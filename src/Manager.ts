import { execSync } from 'child_process'
import {
  // writeFileSync,
  mkdirSync,
  // readFileSync,
  // unlinkSync,
  PathLike,
  writeFileSync,
} from 'fs'
import {
  getBaseRoute,
  getEnv,
  getMainCommonFile,
  getMainFile,
  getRoutesIndex,
} from './templates/typescript'

export class Manager {
  async init(name: string, language: string, pManager: string) {
    const pkgList = ['dotenv', 'express']

    const devPkgListTS = ['@types/node', '@types/express', 'typescript']

    const path = `${process.cwd()}/${name}`
    const paths = [
      `${path}/src`,
      `${path}/common`,
      `${path}/src/routes`,
      `${path}/src/database`,
      `${path}/src/utils`,
      `${path}/src/routes/base`,
    ]
    const packages = pkgList.toString().split(',').join(' ')
    const devPackages = devPkgListTS.toString().split(',').join(' ')

    // if (language === 'js') {
    //   console.log(`${language} -> 'js'`)
    // } else if (language === 'ts') {
    //   console.log(`${language} -> 'ts'`)
    // } else {
    //   return
    // }

    await this.createMainDirectory(path)
    await this.createSubdirectories(paths)
    language === 'js'
      ? this.installDepsJS(pManager, packages, path)
      : this.installDepsTS(pManager, packages, devPackages, path)
    language === 'js'
      ? this.createFilesJS(paths, path)
      : this.createFilesTS(paths, path)
  }

  createMainDirectory(path: PathLike) {
    // console.log(path)
    mkdirSync(path)
  }

  createSubdirectories(paths: string[]) {
    paths.forEach((path) => {
      // console.log(path)
      mkdirSync(path)
    })
  }

  installDepsTS(
    pManager: string,
    packages: string,
    devPackages: string,
    path: string
  ) {
    if (pManager === 'npm') {
      console.log(packages)
      console.log(execSync('npm init -y', { cwd: path }).toString())
      console.log(execSync(`npm install ${packages}`, { cwd: path }).toString())
      console.log(
        execSync(`npm install -D ${devPackages}`, { cwd: path }).toString()
      )
    } else if (pManager === 'yarn') {
      console.log(packages)
      console.log(execSync('yarn init -y', { cwd: path }).toString())
      console.log(execSync(`yarn add ${packages}`, { cwd: path }).toString())
      console.log(
        execSync(`yarn add -D ${devPackages}`, { cwd: path }).toString()
      )
    }
  }

  installDepsJS(pManager: string, packages: string, path: string) {
    if (pManager === 'npm') {
      console.log(packages)
      console.log(execSync('npm init -y', { cwd: path }).toString())
      console.log(execSync(`npm install ${packages}`, { cwd: path }).toString())
    } else if (pManager === 'yarn') {
      console.log(packages)
      console.log(execSync('yarn init -y', { cwd: path }).toString())
      console.log(execSync(`yarn add ${packages}`, { cwd: path }).toString())
    }
  }

  createFilesTS(paths: string[], path: string) {
    writeFileSync(`${path}/.env`, getEnv())
    writeFileSync(`${paths[0].toString()}/App.ts`, getMainFile())
    writeFileSync(
      `${paths[1].toString()}/common.routes.config.ts`,
      getMainCommonFile()
    )
    writeFileSync(`${paths[2]}/index.ts`, getRoutesIndex())
    writeFileSync(`${paths[5]}/base.routes.config.ts`, getBaseRoute())
  }

  createFilesJS(paths: string[], path: string) {}
}
