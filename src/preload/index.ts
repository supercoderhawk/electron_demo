import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type DesktopApi, type UpdateStateEvent } from '@shared/ipc'

const desktopApi: DesktopApi = {
  system: {
    getInfo: (payload) => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO, payload)
  },
  updater: {
    check: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_CHECK),
    download: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_DOWNLOAD),
    quitAndInstall: () => ipcRenderer.invoke(IPC_CHANNELS.UPDATER_QUIT_AND_INSTALL),
    onState: (callback) => {
      const listener = (_event: Electron.IpcRendererEvent, state: UpdateStateEvent): void => {
        callback(state)
      }

      ipcRenderer.on(IPC_CHANNELS.UPDATER_STATE, listener)

      return () => {
        ipcRenderer.removeListener(IPC_CHANNELS.UPDATER_STATE, listener)
      }
    }
  }
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('desktop', desktopApi)
} else {
  ;(window as Window & { desktop: DesktopApi }).desktop = desktopApi
}
