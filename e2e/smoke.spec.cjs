const path = require('node:path')
const { _electron: electron, expect, test } = require('@playwright/test')

const appEntry = path.resolve(__dirname, '../out/main/index.js')
test.setTimeout(90_000)

test('launches the electron shell', async () => {
  const args = [appEntry]
  if (process.platform === 'linux') {
    // Harden Electron startup in headless Linux CI.
    args.push(
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    )
  }

  const app = await electron.launch({
    args,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DISABLE_APP_UPDATER: '1'
    }
  })

  try {
    const window = await app.firstWindow()
    await window.waitForLoadState('domcontentloaded')
    await expect(window.getByRole('heading', { name: /Electron Dual-Track Starter/i })).toBeVisible(
      { timeout: 30_000 }
    )
  } finally {
    await app.close()
  }
})
