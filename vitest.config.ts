import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // cache: false, // If test fails in CI only, run locally with cache=false to be closer to CI environment
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./tests/unit/globalSetup.js', '@vitest/web-worker'],
      coverage: {
        reporter: ['text', 'json-summary', 'json'],
      },
      pool: "forks"
    }
  })
)
