const nextVitals = require("eslint-config-next/core-web-vitals");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  ...nextVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  {
    // Registra el plugin @typescript-eslint (core-web-vitals ya configura el parser TS)
    // sin activar el ruleset completo de next/typescript, para no introducir errores
    // nuevos sobre código preexistente.
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/error-boundaries": "off",
      // Reactivadas como 'warn' tras consolidar la config de ESLint
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
