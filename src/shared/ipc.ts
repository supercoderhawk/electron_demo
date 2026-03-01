export const IPC_CHANNELS = {
  SYSTEM_GET_INFO: 'system:get-info',
  UPDATER_CHECK: 'updater:check',
  UPDATER_DOWNLOAD: 'updater:download',
  UPDATER_QUIT_AND_INSTALL: 'updater:quit-and-install',
  UPDATER_STATE: 'updater:state'
} as const

export type ReleaseLine = 'modern' | 'legacy'

export interface SystemInfoRequest {
  includeOsRelease?: boolean
}

export interface SystemInfo {
  appVersion: string
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  platform: string
  arch: string
  osRelease: string
  releaseLine: ReleaseLine
}

export type UpdateCheckStatus = 'idle' | 'available' | 'not-available' | 'disabled'

export interface UpdateCheckResult {
  status: UpdateCheckStatus
  version?: string
  releaseName?: string
}

export type UpdateStateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'disabled'
  | 'error'

export interface UpdateStateEvent {
  status: UpdateStateStatus
  progress?: number
  message?: string
  version?: string
}

export interface IpcFailure {
  code: string
  message: string
}

export type IpcResult<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: IpcFailure
    }

export const ok = <T>(data: T): IpcResult<T> => ({ ok: true, data })

export const fail = (code: string, message: string): IpcResult<never> => ({
  ok: false,
  error: { code, message }
})

export interface DesktopApi {
  system: {
    getInfo(payload?: SystemInfoRequest): Promise<IpcResult<SystemInfo>>
  }
  updater: {
    check(): Promise<IpcResult<UpdateCheckResult>>
    download(): Promise<IpcResult<null>>
    quitAndInstall(): Promise<IpcResult<null>>
    onState(callback: (event: UpdateStateEvent) => void): () => void
  }
}
