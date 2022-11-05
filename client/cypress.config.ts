import {defineConfig} from 'cypress';

export default defineConfig({
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/test-output-[hash].xml',
    toConsole: true,
    attachments: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // runs before all tests in the project
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSessionAndOrigin: true,
    chromeWebSecurity: false,
  },
});
