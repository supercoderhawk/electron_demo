import type { IpcResult } from '@shared/ipc'

export function unwrapResult<T>(result: IpcResult<T>): T {
  if (!result.ok) {
    throw new Error(`${result.error.code}: ${result.error.message}`)
  }

  return result.data
}

export function toMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return typeof error === 'string' ? error : 'Unknown renderer error'
}
