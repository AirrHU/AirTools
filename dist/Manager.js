"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const typescript_1 = require("./templates/typescript");
class Manager {
    init(name, language, pManager) {
        return __awaiter(this, void 0, void 0, function* () {
            const pkgList = ['dotenv', 'express'];
            const devPkgListTS = ['@types/node', '@types/express', 'typescript'];
            const path = `${process.cwd()}/${name}`;
            const paths = [
                `${path}/src`,
                `${path}/common`,
                `${path}/src/routes`,
                `${path}/src/database`,
                `${path}/src/utils`,
                `${path}/src/routes/base`,
            ];
            const packages = pkgList.toString().split(',').join(' ');
            const devPackages = devPkgListTS.toString().split(',').join(' ');
            yield this.createMainDirectory(path);
            yield this.createSubdirectories(paths);
            language === 'js'
                ? this.installDepsJS(pManager, packages, path)
                : this.installDepsTS(pManager, packages, devPackages, path);
            language === 'js'
                ? this.createFilesJS(paths, path)
                : this.createFilesTS(paths, path);
        });
    }
    createMainDirectory(path) {
        fs_1.mkdirSync(path);
    }
    createSubdirectories(paths) {
        paths.forEach((path) => {
            fs_1.mkdirSync(path);
        });
    }
    installDepsTS(pManager, packages, devPackages, path) {
        if (pManager === 'npm') {
            console.log(packages);
            console.log(child_process_1.execSync('npm init -y', { cwd: path }).toString());
            console.log(child_process_1.execSync(`npm install ${packages}`, { cwd: path }).toString());
            console.log(child_process_1.execSync(`npm install -D ${devPackages}`, { cwd: path }).toString());
        }
        else if (pManager === 'yarn') {
            console.log(packages);
            console.log(child_process_1.execSync('yarn init -y', { cwd: path }).toString());
            console.log(child_process_1.execSync(`yarn add ${packages}`, { cwd: path }).toString());
            console.log(child_process_1.execSync(`yarn add -D ${devPackages}`, { cwd: path }).toString());
        }
    }
    installDepsJS(pManager, packages, path) {
        if (pManager === 'npm') {
            console.log(packages);
            console.log(child_process_1.execSync('npm init -y', { cwd: path }).toString());
            console.log(child_process_1.execSync(`npm install ${packages}`, { cwd: path }).toString());
        }
        else if (pManager === 'yarn') {
            console.log(packages);
            console.log(child_process_1.execSync('yarn init -y', { cwd: path }).toString());
            console.log(child_process_1.execSync(`yarn add ${packages}`, { cwd: path }).toString());
        }
    }
    createFilesTS(paths, path) {
        fs_1.writeFileSync(`${path}/.env`, typescript_1.getEnv());
        fs_1.writeFileSync(`${paths[0].toString()}/App.ts`, typescript_1.getMainFile());
        fs_1.writeFileSync(`${paths[1].toString()}/common.routes.config.ts`, typescript_1.getMainCommonFile());
        fs_1.writeFileSync(`${paths[2]}/index.ts`, typescript_1.getRoutesIndex());
        fs_1.writeFileSync(`${paths[5]}/base.routes.config.ts`, typescript_1.getBaseRoute());
    }
    createFilesJS(paths, path) { }
}
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map