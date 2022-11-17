import { defineConfig } from 'vite';
import { AntdResolve, createStyleImportPlugin } from 'vite-plugin-style-import';
import lodash from 'lodash';
import path from 'path';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

const { upperFirst, camelCase } = lodash;

const isDev = process.env.VITE_ENV === 'dev';

const pkgName = upperFirst(camelCase(pkg.name.replace(/^.*?([\w-]+)$/, '$1')));

function resolve(url: string) {
  return path.resolve(__dirname, url);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  envPrefix: 'APP_',
  server: {
    host: '0.0.0.0',
  },
  build: {
    outDir: isDev ? resolve('./example') : 'lib',
    lib: isDev
      ? undefined
      : {
        entry: resolve('./src'),
        name: pkgName,
        formats: ['es', 'umd'],
        fileName: (format) => `index.${format}.js`,
      },
    rollupOptions: isDev
      ? {}
      : {
        external: ['react', 'react-dom', 'antd'],
        output: {
          globals: {
            react: 'react',
            antd: 'antd',
            'react-dom': 'react-dom',
          },
        },
      },
  },
  resolve: {
    alias: {
      '@': resolve('./demo'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: isDev
    ? [
      legacy(),
      react(),
      createStyleImportPlugin({
        resolves: [AntdResolve()],
      }),
    ]
    : [react(), dts()],
});
