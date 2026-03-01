import { useEffect, useState } from 'react'
import type { UpdateCheckResult, UpdateStateEvent } from '@shared/ipc'
import { toMessage, unwrapResult } from '@renderer/lib/ipc'

const idleCheckResult: UpdateCheckResult = { status: 'idle' }
const idleState: UpdateStateEvent = { status: 'idle' }

export function useUpdater(): {
  checkResult: UpdateCheckResult
  stateEvent: UpdateStateEvent
  error: string | null
  isChecking: boolean
  isDownloading: boolean
  check: () => Promise<void>
  download: () => Promise<void>
  installNow: () => Promise<void>
} {
  const [checkResult, setCheckResult] = useState<UpdateCheckResult>(idleCheckResult)
  const [stateEvent, setStateEvent] = useState<UpdateStateEvent>(idleState)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    return window.desktop.updater.onState((event) => {
      setStateEvent(event)
    })
  }, [])

  const check = async (): Promise<void> => {
    setIsChecking(true)
    setError(null)

    try {
      const response = await window.desktop.updater.check()
      setCheckResult(unwrapResult(response))
    } catch (reason) {
      setError(toMessage(reason))
    } finally {
      setIsChecking(false)
    }
  }

  const download = async (): Promise<void> => {
    setIsDownloading(true)
    setError(null)

    try {
      unwrapResult(await window.desktop.updater.download())
    } catch (reason) {
      setError(toMessage(reason))
    } finally {
      setIsDownloading(false)
    }
  }

  const installNow = async (): Promise<void> => {
    setError(null)

    try {
      unwrapResult(await window.desktop.updater.quitAndInstall())
    } catch (reason) {
      setError(toMessage(reason))
    }
  }

  return {
    checkResult,
    stateEvent,
    error,
    isChecking,
    isDownloading,
    check,
    download,
    installNow
  }
}
