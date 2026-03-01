const path = require('node:path')
const { _electron: electron, expect, test } = require('@playwright/test')

const appEntry = path.resolve(__dirname, '../out/main/index.js')

test('launches the electron shell', async () => {
  const app = await electron.launch({
    args: [appEntry],
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DISABLE_APP_UPDATER: '1'
    }
  })

  const window = await app.firstWindow()
  await expect(window.getByRole('heading', { name: 'Electron Dual-Track Starter' })).toBeVisible()

  await app.close()
})
