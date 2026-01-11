import { defineConfig } from "tsup";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import fs from "fs";
import path from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["react", "react-dom", "recharts"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    // Process Tailwind CSS
    const cssEntry = path.resolve(__dirname, "src/styles/index.css");
    const cssOutput = path.resolve(__dirname, "dist/styles.css");

    const css = fs.readFileSync(cssEntry, "utf-8");

    const result = await postcss([
      tailwindcss(path.resolve(__dirname, "tailwind.config.js")),
      autoprefixer,
    ]).process(css, {
      from: cssEntry,
      to: cssOutput,
    });

    // Write standalone CSS file (for users who prefer manual import)
    fs.writeFileSync(cssOutput, result.css);
    console.log("✓ CSS bundle generated: dist/styles.css");

    // Inject CSS into JS bundles
    const cssContent = result.css
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");

    const injectCode = `
;(function() {
  if (typeof document === 'undefined') return;
  var id = '__usefy_memory_monitor_styles__';
  if (document.getElementById(id)) return;
  var style = document.createElement('style');
  style.id = id;
  style.textContent = \`${cssContent}\`;
  document.head.appendChild(style);
})();
`;

    // Append to ESM bundle
    const esmPath = path.resolve(__dirname, "dist/index.mjs");
    const esmContent = fs.readFileSync(esmPath, "utf-8");
    fs.writeFileSync(esmPath, esmContent + injectCode);

    // Append to CJS bundle
    const cjsPath = path.resolve(__dirname, "dist/index.js");
    const cjsContent = fs.readFileSync(cjsPath, "utf-8");
    fs.writeFileSync(cjsPath, cjsContent + injectCode);

    console.log("✓ CSS injected into JS bundles");
  },
});
