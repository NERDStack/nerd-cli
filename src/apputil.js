const chalk = require('chalk');

function leftpad(message) {
  return `  ${message}`;
}

module.exports.displayError = err => {
  if (err.message) {
    console.log(chalk.bold.red(leftpad(err.message)));
  }
  else {
    console.log(chalk.bold.red(leftpad(err.message)));
  }
};

module.exports.displayInfo = message => {
  console.log(chalk.bold.yellow(leftpad(message)));
};

module.exports.displayAction = message => {
  console.log(chalk.bold.blue(leftpad(message)));
};
