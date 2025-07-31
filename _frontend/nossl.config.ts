import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import * as child from "child_process"

const commitHash = child.execSync("git rev-parse --short HEAD").toString() //i.e., 706e821
const tagAndCommitHash = child.execSync("git describe --always --tags").toString() //i.e., v23.5.0-1-g706e821
const buildDate = new Date().toUTCString()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    pluginRewriteAll(), // See vite issue: https://github.com/vitejs/vite/issues/2190
    nodePolyfills({ // hashgraph/proto needs NodeJS buffers
      exclude: [
        'fs', // Excludes the polyfill for `fs` and `node:fs`.
      ],
      globals: {
        Buffer: true,
        global: false,
        process: false,
      },
      protocolImports: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // else hashconnect crashes because require() is undefined :(
    },
  },
  define: {
    'import.meta.env.VITE_BUILD_SHORTCOMMITHASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_BUILD_RELEASE': JSON.stringify(tagAndCommitHash),
    'import.meta.env.VITE_BUILD_TIME_UTC': JSON.stringify(buildDate),
  },
  worker: {
    format: "es",
  }
})
