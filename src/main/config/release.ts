import type { ReleaseLine } from '@shared/ipc'

const envReleaseLine = process.env.RELEASE_LINE

export const releaseLine: ReleaseLine = envReleaseLine === 'legacy' ? 'legacy' : 'modern'

export const updaterEnabled =
  process.env.DISABLE_APP_UPDATER === '1' ? false : releaseLine === 'modern'
