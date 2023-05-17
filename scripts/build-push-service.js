const { exec } = require("child_process");
const dotenv = require("dotenv");
dotenv.config();

const args = process.argv;
exec(
  `gh workflow run .github/workflows/build-service.yml -f service_name=${args[2]}`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);
