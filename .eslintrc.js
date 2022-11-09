// .eslintrc.js
module.exports = {
  extends: ['alloy', 'alloy/vue'],
  env: {
    // Your environments (which contains several predefined global variables)
    node: true,
    browser: true,
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    window: false,
    document: false,
    navigator: false,
    NODE_ENV: 'readonly',
  },
  rules: {},
};
