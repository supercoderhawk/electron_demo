import { app, ipcMain } from 'electron'
import os from 'node:os'
import { z } from 'zod'
import {
  fail,
  IPC_CHANNELS,
  ok,
  type IpcResult,
  type SystemInfo,
  type SystemInfoRequest
} from '@shared/ipc'
import { releaseLine } from '@main/config/release'

const systemRequestSchema = z
  .object({
    includeOsRelease: z.boolean().optional()
  })
  .optional()

export function registerSystemIpc(): void {
  ipcMain.handle(
    IPC_CHANNELS.SYSTEM_GET_INFO,
    async (_event, payload: unknown): Promise<IpcResult<SystemInfo>> => {
      const parsed = systemRequestSchema.safeParse(payload)

      if (!parsed.success) {
        return fail('INVALID_SYSTEM_REQUEST', 'Invalid payload for system:get-info.')
      }

      const request: SystemInfoRequest = parsed.data ?? {}

      return ok({
        appVersion: app.getVersion(),
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
        nodeVersion: process.versions.node,
        platform: process.platform,
        arch: process.arch,
        osRelease: request.includeOsRelease === false ? 'hidden' : os.release(),
        releaseLine
      })
    }
  )
}
