import nextConfig from "@cafedebug/eslint-config/next";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  ...nextConfig,
  { files: ["next-env.d.ts"], rules: { "@typescript-eslint/triple-slash-reference": "off" } },
  { plugins: { "@next/next": nextPlugin }, rules: { ...nextPlugin.configs["core-web-vitals"].rules } }
];
