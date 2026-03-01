import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.cjs',
  timeout: 120_000,
  workers: 1,
  use: {
    trace: 'retain-on-failure'
  }
})
