import { beforeEach, describe, expect, it } from 'vitest'
import { useCounterStore } from '@renderer/stores/counterStore'

describe('counterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 })
  })

  it('increments count', () => {
    useCounterStore.getState().increment()
    useCounterStore.getState().increment()

    expect(useCounterStore.getState().count).toBe(2)
  })

  it('resets count', () => {
    useCounterStore.getState().increment()
    useCounterStore.getState().reset()

    expect(useCounterStore.getState().count).toBe(0)
  })
})
