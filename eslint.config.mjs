const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "prisma/generated/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {},
  },
];

export default eslintConfig;
