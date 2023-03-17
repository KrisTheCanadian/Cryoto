import {defineConfig} from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 5,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return config;
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSessionAndOrigin: true,
    chromeWebSecurity: false,
  },
});
