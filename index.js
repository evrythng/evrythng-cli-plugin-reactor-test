/**
 * (c) Copyright Reserved EVRYTHNG Limited 2019.
 * All rights reserved. Use of this material is subject to license.
 */

const { validate } = require('jsonschema');
const fs = require('fs');
const { execute } = require('./lib/runner');

const CONFIG_SCHEMA = {
  required: ['apiUrl', 'function', 'event', 'realistic'],
  properties: {
    apiUrl: {
      type: 'string',
    },
    function: {
      type: 'string',
      enum: [
        'onActionCreated',
        'onThngPropertiesChanged',
        'onProductPropertiesChanged',
        'onScheduledEvent',
      ],
    },
    event: {
      type: 'object',
    },
    realistic: {
      type: 'boolean',
    },
  },
};

const DEFAULT_CONFIG = {
  apiUrl: 'https://api.evrythng.com',
  function: 'onActionCreated',
  event: {
    action: {},
  },
  realistic: false,
};

let cli;

/**
 * Validate the config file.
 *
 * @param {object} config - The config object.
 */
const validateConfig = (config) => {
  const validation = validate(config, CONFIG_SCHEMA);
  if (validation.errors.length) {
    const lines = validation.errors.map(p => p.stack).join('\n');
    throw new Error(`Validation errors:\n${lines}`);
  }
};

/**
 * Create a default config file.
 */
const writeDefaultConfig = () => {
  const path = `${process.cwd()}/config.json`;
  fs.writeFileSync(path, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
  console.log(`Wrote ${path}`);
};

/**
 * Run the script itself..
 *
 * @param {string} scriptPath - Path to the script file to execute.
 * @param {string} configPath - Path to the config file.
 */
const runScript = (scriptPath, configPath) => {
  const { API_KEY } = cli.getSwitches();
  if (!API_KEY) {
    throw new Error('--api-key must be specified with a Trusted Application API Key.');
  }
  if (!fs.existsSync(scriptPath) || !scriptPath.includes('.js')) {
    throw new Error(`Invalid script path: ${scriptPath}`);
  }
  if (!fs.existsSync(configPath) || !configPath.includes('.json')) {
    throw new Error(`Invalid config.json path: ${configPath}`);
  }

  const configJson = JSON.parse(fs.readFileSync(configPath));
  validateConfig(configJson);
  execute(API_KEY, scriptPath, configJson);
};

module.exports = (api) => {
  cli = api;

  const command = {
    about: 'Test a Reactor script using a config.json file describing the event.',
    firstArg: 'reactor-test',
    operations: {
      run: {
        execute: async ([, scriptPath, configPath]) => runScript(scriptPath, configPath),
        pattern: 'run $script $config',
        helpPattern: 'run $script $config --api-key $trustedAppApiKey',
      },
      'create-config': {
        execute: async args => writeDefaultConfig(),
        pattern: 'create-config',
      },
    },
  };

  api.registerCommand(command);
};
