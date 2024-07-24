import { exec } from 'child_process';

export const executeCommandLine = function (command: string) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`The stdout Buffer from shell: ${stdout.toString()}`);
      console.log(`The stderr Buffer from shell: ${stderr.toString()}`);
    }
  });
};
