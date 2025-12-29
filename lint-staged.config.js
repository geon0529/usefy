module.exports = {
  "packages/**/*.{ts,tsx,js,jsx}": (files) =>
    `vitest related --run --config vitest.packages.config.ts ${files.join(
      " "
    )}`,
  "packages/**/*.{ts,tsx}": () => "turbo run typecheck",
};
