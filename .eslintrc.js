module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    // Code quality rules
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-console": "off",
    "no-process-exit": "off",
    "no-var": "error",
    "prefer-const": "warn",
    "prefer-arrow-callback": "off",
    "arrow-spacing": "error",
    "no-duplicate-imports": "error",
    "no-useless-return": "warn",
    "no-useless-concat": "warn",
    "prefer-template": "off",

    // Style rules
    indent: "off",
    quotes: "off",
    semi: ["error", "always"],
    "comma-dangle": "off",
    "object-curly-spacing": "off",
    "array-bracket-spacing": "off",
    "space-before-function-paren": "off",
    "keyword-spacing": "off",
    "space-infix-ops": "off",
    "eol-last": "off",
    "no-trailing-spaces": "off",
    "no-multiple-empty-lines": "off",

    // Documentation rules
    "valid-jsdoc": "off",

    // Error prevention
    "no-case-declarations": "off",
    "no-constant-condition": "off",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "no-alert": "error",
    "no-debugger": "warn",
    "no-duplicate-case": "warn",
    "no-empty": "warn",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "warn",
    "no-extra-semi": "warn",
    "no-func-assign": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "warn",
    "no-obj-calls": "error",
    "no-regex-spaces": "warn",
    "no-sparse-arrays": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "use-isnan": "error",
    "valid-typeof": "error",
  },
  overrides: [
    {
      // Test files
      files: ["test/**/*.js"],
      env: {
        jest: true,
      },
      rules: {
        "no-console": "off",
      },
    },
    {
      // CLI files
      files: ["bin/**/*.js"],
      rules: {
        "no-console": "off",
        "no-process-exit": "off",
      },
    },
  ],
};
