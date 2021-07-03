"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.push = void 0;
const fs_1 = require("fs");
const valid_url_1 = require("valid-url");
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
const push = (url, branch, prompt) => {
    try {
        if (valid_url_1.isWebUri(url) && url.endsWith('.git')) {
            prompt([
                {
                    type: 'confirm',
                    name: 'decision',
                    message: `Are you sure you want to make push to branch ${branch} ?\n ! If you get "fatal: 'origin' does not appear to be a git repository", make sure that you have global user config set up in Git (https://linuxize.com/post/how-to-configure-git-username-and-email/). `,
                },
            ]).then(({ decision }) => {
                if (decision) {
                    const _dir = fs_1.readdirSync(process.cwd());
                    if (_dir.includes('.git')) {
                        const dir = fs_1.readdirSync(`${process.cwd()}/.git/refs/remotes/`);
                        if (!dir.includes('origin')) {
                            exec(`git remote add origin ${url}`);
                        }
                        exec(`git push origin ${branch}`);
                    }
                    else {
                        return console.log('😶 This directory does not have Git initialized!');
                    }
                }
                else {
                    return console.log('✅️ Operation successfully canceled!');
                }
            });
        }
        else {
            return console.log('❌️ Invalid URL.');
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.push = push;
//# sourceMappingURL=push.js.map