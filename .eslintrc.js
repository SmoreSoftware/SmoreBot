module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "2017"
  },
  "rules": {
    "accessor-pairs": "error",
    "array-bracket-newline": "off",
    "array-bracket-spacing": [
      "error", "never"
    ],
    "array-callback-return": "error",
    "array-element-newline": "off",
    "arrow-body-style": "error",
    "arrow-parens": "off",
    "arrow-spacing": [
      "error", {
        "after": true,
        "before": true
      }
    ],
    "block-scoped-var": "error",
    "block-spacing": "error",
    "brace-style": [
      "error", "1tbs"
    ],
    "callback-return": "error",
    "camelcase": "error",
    "capitalized-comments": "off",
    "class-methods-use-this": "warn",
    "comma-dangle": "error",
    "comma-spacing": [
      "error", {
        "after": true,
        "before": false
      }
    ],
    "comma-style": [
      "error", "last"
    ],
    "complexity": "off",
    "computed-property-spacing": "error",
    "consistent-return": "off",
    "consistent-this": "error",
    "curly": "off",
    "default-case": "error",
    "dot-location": [
      "error", "property"
    ],
    "dot-notation": [
      "error", {
        "allowKeywords": true
      }
    ],
    "eol-last": "error",
    "eqeqeq": "error",
    "for-direction": "warn",
    "func-call-spacing": "error",
    "func-name-matching": "error",
    "func-names": [
      "error", "never"
    ],
    "func-style": "off",
    "generator-star-spacing": "error",
    "global-require": "off",
    "guard-for-in": "warn",
    "handle-callback-err": "error",
    "id-blacklist": "error",
    "id-length": "off",
    "id-match": "error",
    "indent": "off",
    "indent-legacy": "off",
    "init-declarations": "off",
    "jsx-quotes": "error",
    "key-spacing": "error",
    "keyword-spacing": [
      "error", {
        "after": true,
        "before": true
      }
    ],
    "line-comment-position": "off",
    "linebreak-style": [
      "error", "unix"
    ],
    "lines-around-comment": [
      "warn", {
        "afterBlockComment": true
      }
    ],
    "lines-around-directive": "error",
    "max-depth": [
      "warn", {
        "max": 4
      }
    ],
    "max-len": "off",
    "max-lines": "off",
    "max-nested-callbacks": "error",
    "max-params": "off",
    "max-statements": 'off',
    "max-statements-per-line": [
      "warn", {
        "max": 1
      }
    ],
    "multiline-ternary": [
      "error", "never"
    ],
    "new-cap": "warn",
    "new-parens": "warn",
    "newline-after-var": "off",
    "newline-before-return": "warn",
    "newline-per-chained-call": "warn",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-await-in-loop": "error",
    "no-bitwise": "error",
    "no-buffer-constructor": "off",
    "no-caller": "error",
    "no-catch-shadow": "error",
    "no-confusing-arrow": "error",
    "no-console": "off",
    "no-continue": "error",
    "no-div-regex": "error",
    "no-duplicate-imports": "warn",
    "no-else-return": "warn",
    "no-empty": "warn",
    "no-empty-function": "warn",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-extra-parens": "error",
    "no-floating-decimal": "warn",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "off",
    "no-implied-eval": "warn",
    "no-inline-comments": "off",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-magic-numbers": "off",
    "no-mixed-operators": "error",
    "no-mixed-requires": "error",
    "no-multi-assign": "warn",
    "no-multi-spaces": "warn",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "error",
    "no-native-reassign": "error",
    "no-negated-condition": "error",
    "no-negated-in-lhs": "error",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "off",
    "no-path-concat": "warn",
    "no-plusplus": "off",
    "no-process-env": "error",
    "no-process-exit": "off",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-restricted-globals": "error",
    "no-restricted-imports": "error",
    "no-restricted-modules": "error",
    "no-restricted-properties": "error",
    "no-restricted-syntax": "error",
    "no-return-assign": "off",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "no-spaced-func": "error",
    "no-sync": "error",
    "no-tabs": "off",
    "no-template-curly-in-string": "error",
    "no-ternary": "off",
    "no-throw-literal": "error",
    "no-trailing-spaces": "warn",
    "no-undef-init": "error",
    "no-undefined": "error",
    "no-underscore-dangle": "error",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "warn",
    "no-unused-expressions": "warn",
    "no-unused-vars": "warn",
    "no-use-before-define": "warn",
    "no-useless-call": "warn",
    "no-useless-computed-key": "warn",
    "no-useless-concat": "warn",
    "no-useless-constructor": "warn",
    "no-useless-escape": "warn",
    "no-useless-rename": "warn",
    "no-useless-return": "warn",
    "no-var": "warn",
    "no-void": "error",
    "no-warning-comments": "warn",
    "no-whitespace-before-property": "warn",
    "no-with": "error",
    "nonblock-statement-body-position": "error",
    "object-curly-newline": "off",
    "object-curly-spacing": [
      "warn", "always"
    ],
    "object-property-newline": "error",
    "object-shorthand": "off",
    "one-var": "off",
    "one-var-declaration-per-line": "error",
    "operator-assignment": "error",
    "operator-linebreak": "error",
    "padded-blocks": "off",
    "padding-line-between-statements": "off",
    "prefer-arrow-callback": "off",
    "prefer-const": "off",
    "prefer-numeric-literals": "error",
    "prefer-promise-reject-errors": "error",
    "prefer-reflect": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "off",
    "quote-props": "off",
    "quotes": [
      "error", "single"
    ],
    "radix": "off",
    "require-await": "off",
    "require-jsdoc": "off",
    "rest-spread-spacing": "error",
    "semi": "off",
    "semi-spacing": [
      "error", {
        "after": false,
        "before": false
      }
    ],
    "semi-style": "off",
    "sort-imports": "error",
    "sort-keys": "off",
    "sort-vars": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": "off",
    "space-in-parens": [
      "error", "never"
    ],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "off",
    "strict": "error",
    "switch-colon-spacing": "off",
    "symbol-description": "error",
    "template-curly-spacing": [
      "error", "never"
    ],
    "template-tag-spacing": [
      "error", "always"
    ],
    "unicode-bom": [
      "error", "never"
    ],
    "unexpected-token": "off",
    "valid-jsdoc": "error",
    "vars-on-top": "error",
    "wrap-iife": "error",
    "wrap-regex": "error",
    "yield-star-spacing": "error",
    "yoda": ["error", "never"]
  }
};
