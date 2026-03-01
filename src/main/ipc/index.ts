import { registerSystemIpc } from '@main/ipc/system'
import { registerUpdaterIpc } from '@main/ipc/updater'
import { UpdaterService } from '@main/services/updater'

export function registerIpcHandlers(updaterService: UpdaterService): void {
  registerSystemIpc()
  registerUpdaterIpc(updaterService)
}
