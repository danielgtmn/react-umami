import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm'],
    entry: ['./src/index.tsx'],
    dts: true,
    shims: true,
    minify: true,
    skipNodeModulesBundle: true,
    clean: true,
});