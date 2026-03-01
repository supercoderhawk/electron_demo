import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from '@main/app/window'
import { releaseLine, updaterEnabled } from '@main/config/release'
import { registerIpcHandlers } from '@main/ipc'
import { UpdaterService } from '@main/services/updater'

const updaterService = new UpdaterService({ enabled: updaterEnabled })

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.yubin.electrondemo')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers(updaterService)

  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })

  console.log(`[bootstrap] releaseLine=${releaseLine} updaterEnabled=${updaterEnabled}`)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
