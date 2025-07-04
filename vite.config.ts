import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import * as child from "child_process"
import {readFileSync} from "fs"

const commitHash = child.execSync("git rev-parse --short HEAD").toString() //i.e., 706e821
const tagAndCommitHash = resolveVersion() //i.e., v23.5.0-1-g706e821
const buildDate = new Date().toUTCString()

function resolveVersion() {
  try {
    const shortHash = child.execSync("git rev-parse --short HEAD").toString().trim()
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
    return `v${packageJson.version}+${shortHash}`
  } catch {
    console.error('Could not read package.json')
    return child.execSync("git describe --always --tags").toString()
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@bokuweb/zstd-wasm'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  plugins: [
    vue(),
    basicSsl(),
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
