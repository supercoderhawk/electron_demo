export function AboutPage(): React.JSX.Element {
  return (
    <section className="panel">
      <h2>About this scaffold</h2>
      <p>
        This project is intentionally structured for learning Electron: strict TypeScript, isolated
        preload API, contract-first IPC, and CI-driven multi-platform packaging.
      </p>
      <ul>
        <li>Main branch: modern Electron with auto-update enabled.</li>
        <li>Legacy branch: Electron 22 compatibility line with updater disabled.</li>
        <li>Windows build targets: x86 + x64 for both lines.</li>
      </ul>
    </section>
  )
}
