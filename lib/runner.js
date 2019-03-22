/**
 * (c) Copyright Reserved EVRYTHNG Limited 2019.
 * All rights reserved. Use of this material is subject to license.
 */

const EVT = require('evrythng-extended');

const logs = [];

global.EVT = EVT;

/**
 * Global 'done' function.
 */
global.done = () => {
  if (config.realistic) {
    logs.forEach(line => console.log(line));
  }
};

/**
 * Global 'log' function.
 *
 * @param {string} msg - The log content.
 */
const log = (msg) => {
  var datetime = new Date().toString();
  datetime = datetime.substring(datetime.indexOf(':') - 2, datetime.indexOf('GMT') - 1);
  msg = `${datetime}: ${msg}`;

  if (config.realistic) {
    logs.push(msg);
    return;
  }

  console.log(msg);
};

/**
 * Prettify any kind of error.
 *
 * @param {object} e - The Error or error object.
 * @returns {string} The log message equivalent of the error.
 */
const printError = e => `Error: ${e.message || JSON.stringify(e)} ${e.stack}`;

/**
 * Load and execute the script using the provided config file.
 *
 * @param {string} apiKey - The Trusted Application API Key.
 * @param {scriptPath} - Path to the script, which must export the event function.
 * @param {object} configJson - The pre-loaded config object.
 */
const execute = (apiKey, scriptPath, configJson) => {
  config = configJson;
  const { apiUrl, event, realistic } = configJson;

  EVT.setup({ apiUrl: apiUrl });
  
  global.app = new EVT.TrustedApp(apiKey);
  global.logger = {
    debug: log,
    info: log,
    warn: log,
    error: log,
  };

  if (!realistic) {
    process.on('unhandledRejection', e => console.log(`Unhandled rejection: ${printError(e)}`));
    process.on('uncaughtException',  e => console.log(`Uncaught exception: ${printError(e)}`));
  }

  try {
    const scriptModule = require(`${process.cwd()}/${scriptPath}`);
    if (!scriptModule[config.function]) {
      console.log(`The event function '${config.function}' was not exported from script '${scriptPath}'.`);
      return;
    }
     
    scriptModule[config.function](event);
  } catch (e) {
    if (!realistic) {
      console.log(`Could not execute reactor script: ${printError(e)}`);
    }
  }
};

module.exports = {
  execute,
};
