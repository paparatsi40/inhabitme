const nextVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  ...nextVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
