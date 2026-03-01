import { useQuery } from '@tanstack/react-query'
import { useUpdater } from '@renderer/hooks/useUpdater'
import { unwrapResult } from '@renderer/lib/ipc'
import { useCounterStore } from '@renderer/stores/counterStore'

export function HomePage(): React.JSX.Element {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const reset = useCounterStore((state) => state.reset)

  const systemQuery = useQuery({
    queryKey: ['system-info'],
    queryFn: async () => unwrapResult(await window.desktop.system.getInfo()),
    staleTime: 60_000
  })

  const updater = useUpdater()

  return (
    <div className="panel-grid">
      <section className="panel">
        <h2>System</h2>
        <button onClick={() => systemQuery.refetch()} type="button">
          Refresh system info
        </button>
        {systemQuery.isLoading && <p>Loading system info...</p>}
        {systemQuery.isError && <p className="error">Failed to load system info.</p>}
        {systemQuery.data && (
          <dl className="kv-grid">
            <dt>Release line</dt>
            <dd>{systemQuery.data.releaseLine}</dd>
            <dt>Platform</dt>
            <dd>
              {systemQuery.data.platform} / {systemQuery.data.arch}
            </dd>
            <dt>App version</dt>
            <dd>{systemQuery.data.appVersion}</dd>
            <dt>Electron</dt>
            <dd>{systemQuery.data.electronVersion}</dd>
            <dt>Chrome</dt>
            <dd>{systemQuery.data.chromeVersion}</dd>
            <dt>Node.js</dt>
            <dd>{systemQuery.data.nodeVersion}</dd>
            <dt>OS release</dt>
            <dd>{systemQuery.data.osRelease}</dd>
          </dl>
        )}
      </section>

      <section className="panel">
        <h2>Updater</h2>
        <p>
          Check, download, and install updates with the same IPC contract on both release lines.
        </p>
        <div className="button-row">
          <button disabled={updater.isChecking} onClick={() => void updater.check()} type="button">
            {updater.isChecking ? 'Checking...' : 'Check updates'}
          </button>
          <button
            disabled={updater.isDownloading}
            onClick={() => void updater.download()}
            type="button"
          >
            {updater.isDownloading ? 'Downloading...' : 'Download update'}
          </button>
          <button onClick={() => void updater.installNow()} type="button">
            Restart and install
          </button>
        </div>

        <dl className="kv-grid">
          <dt>Check status</dt>
          <dd>{updater.checkResult.status}</dd>
          <dt>Updater state</dt>
          <dd>{updater.stateEvent.status}</dd>
          <dt>Progress</dt>
          <dd>
            {typeof updater.stateEvent.progress === 'number'
              ? `${updater.stateEvent.progress.toFixed(1)}%`
              : '-'}
          </dd>
          <dt>Version</dt>
          <dd>{updater.stateEvent.version ?? updater.checkResult.version ?? '-'}</dd>
          <dt>Message</dt>
          <dd>{updater.stateEvent.message ?? '-'}</dd>
        </dl>

        {updater.error && <p className="error">{updater.error}</p>}
      </section>

      <section className="panel">
        <h2>Zustand demo</h2>
        <p>Counter: {count}</p>
        <div className="button-row">
          <button onClick={increment} type="button">
            Increment
          </button>
          <button onClick={reset} type="button">
            Reset
          </button>
        </div>
      </section>
    </div>
  )
}
