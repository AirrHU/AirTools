"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commit = void 0;
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
const commit = (msg, prompt) => {
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
                    const { stdout } = exec('git add .');
                    const { stdout: output } = exec(`git commit -m "${msg.toString()}"`);
                    return output && stdout ? { output, stdout } : null;
                }
                else {
                    return console.log('✅️ Operation successfully canceled!');
                }
            });
        }
        else {
            console.error(`🥞 The commit message must be a string!`);
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.commit = commit;
//# sourceMappingURL=commit.js.map