import { describe, expect, it } from 'vitest'
import { unwrapResult } from '@renderer/lib/ipc'

describe('unwrapResult', () => {
  it('returns data for successful IPC responses', () => {
    const result = unwrapResult({ ok: true, data: { version: '1.2.3' } })

    expect(result.version).toBe('1.2.3')
  })

  it('throws for failed IPC responses', () => {
    expect(() =>
      unwrapResult({
        ok: false,
        error: {
          code: 'UPDATER_CHECK_FAILED',
          message: 'network down'
        }
      })
    ).toThrow('UPDATER_CHECK_FAILED')
  })
})
