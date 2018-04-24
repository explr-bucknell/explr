module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    // "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module",
        "allowImportExportEverywhere": false,
        "codeFrame": false,
        "ecmaFeatures": {
          "jsx": true
        }
    },
    "rules": {
        // "indent": [
        //   "error",
        //   "tab"
        // ],
        "quotes": [
          "error",
          "single"
        ],
        "semi": [
          "error",
          "never"
        ],
        "curly": [
          "error",
          "multi-line"
        ],
        "array-bracket-spacing": [
          "error", "never"
        ],
        "block-spacing": "error",
        "brace-style": [
          "error",
          "1tbs",
          { "allowSingleLine": true }
        ],
      }

};
