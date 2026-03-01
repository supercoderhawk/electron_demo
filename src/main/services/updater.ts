import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import { IPC_CHANNELS, type UpdateCheckResult, type UpdateStateEvent } from '@shared/ipc'
import { toErrorMessage } from '@main/utils/errors'

interface UpdaterServiceOptions {
  enabled: boolean
}

export class UpdaterService {
  private readonly enabled: boolean

  private currentState: UpdateStateEvent = { status: 'idle' }

  constructor(options: UpdaterServiceOptions) {
    this.enabled = options.enabled

    if (!this.enabled) {
      this.currentState = {
        status: 'disabled',
        message: 'Updater is disabled for this release line.'
      }
      return
    }

    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = false

    this.bindEvents()
  }

  async checkForUpdates(): Promise<UpdateCheckResult> {
    if (!this.enabled) {
      return { status: 'disabled' }
    }

    this.emitState({ status: 'checking', message: 'Checking for updates...' })

    const result = await autoUpdater.checkForUpdates()
    const updateInfo = result?.updateInfo

    if (!updateInfo) {
      this.emitState({ status: 'not-available', message: 'No update metadata available.' })
      return { status: 'not-available' }
    }

    if (updateInfo.version && updateInfo.version !== app.getVersion()) {
      const nextState: UpdateStateEvent = {
        status: 'available',
        message: 'Update is available.',
        version: updateInfo.version
      }

      this.emitState(nextState)

      return {
        status: 'available',
        version: updateInfo.version,
        releaseName: updateInfo.releaseName ?? undefined
      }
    }

    this.emitState({ status: 'not-available', message: 'You are on the latest version.' })

    return {
      status: 'not-available',
      version: app.getVersion()
    }
  }

  async downloadUpdate(): Promise<void> {
    if (!this.enabled) {
      return
    }

    await autoUpdater.downloadUpdate()
  }

  async quitAndInstall(): Promise<void> {
    if (!this.enabled) {
      return
    }

    autoUpdater.quitAndInstall()
  }

  getState(): UpdateStateEvent {
    return this.currentState
  }

  private bindEvents(): void {
    autoUpdater.on('update-available', (info) => {
      this.emitState({
        status: 'available',
        message: 'Update is available.',
        version: info.version
      })
    })

    autoUpdater.on('update-not-available', () => {
      this.emitState({
        status: 'not-available',
        message: 'No update found.'
      })
    })

    autoUpdater.on('download-progress', (progress) => {
      this.emitState({
        status: 'downloading',
        progress: progress.percent,
        message: `Downloading update: ${progress.percent.toFixed(1)}%`
      })
    })

    autoUpdater.on('update-downloaded', (info) => {
      this.emitState({
        status: 'downloaded',
        message: 'Update downloaded. Restart to install.',
        version: info.version
      })
    })

    autoUpdater.on('error', (error) => {
      this.emitState({
        status: 'error',
        message: toErrorMessage(error)
      })
    })
  }

  private emitState(state: UpdateStateEvent): void {
    this.currentState = state

    for (const window of BrowserWindow.getAllWindows()) {
      if (!window.isDestroyed()) {
        window.webContents.send(IPC_CHANNELS.UPDATER_STATE, state)
      }
    }
  }
}
