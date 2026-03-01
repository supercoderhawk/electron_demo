import { ipcMain } from 'electron'
import { z } from 'zod'
import { fail, IPC_CHANNELS, ok, type IpcResult, type UpdateCheckResult } from '@shared/ipc'
import { UpdaterService } from '@main/services/updater'
import { toErrorMessage } from '@main/utils/errors'

const emptyPayloadSchema = z.union([z.undefined(), z.null()])

function validateEmptyPayload(payload: unknown): boolean {
  return emptyPayloadSchema.safeParse(payload).success
}

export function registerUpdaterIpc(updaterService: UpdaterService): void {
  ipcMain.handle(
    IPC_CHANNELS.UPDATER_CHECK,
    async (_event, payload: unknown): Promise<IpcResult<UpdateCheckResult>> => {
      if (!validateEmptyPayload(payload)) {
        return fail('INVALID_UPDATER_REQUEST', 'updater:check does not accept payload.')
      }

      try {
        return ok(await updaterService.checkForUpdates())
      } catch (error) {
        return fail('UPDATER_CHECK_FAILED', toErrorMessage(error))
      }
    }
  )

  ipcMain.handle(
    IPC_CHANNELS.UPDATER_DOWNLOAD,
    async (_event, payload: unknown): Promise<IpcResult<null>> => {
      if (!validateEmptyPayload(payload)) {
        return fail('INVALID_UPDATER_REQUEST', 'updater:download does not accept payload.')
      }

      try {
        await updaterService.downloadUpdate()
        return ok(null)
      } catch (error) {
        return fail('UPDATER_DOWNLOAD_FAILED', toErrorMessage(error))
      }
    }
  )

  ipcMain.handle(
    IPC_CHANNELS.UPDATER_QUIT_AND_INSTALL,
    async (_event, payload: unknown): Promise<IpcResult<null>> => {
      if (!validateEmptyPayload(payload)) {
        return fail('INVALID_UPDATER_REQUEST', 'updater:quit-and-install does not accept payload.')
      }

      try {
        await updaterService.quitAndInstall()
        return ok(null)
      } catch (error) {
        return fail('UPDATER_INSTALL_FAILED', toErrorMessage(error))
      }
    }
  )
}
