import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>🎙️ Cyber Talks Calendar</h1>
        <p>Mobile-first calendar for live streams — Deployment Test</p>
      </header>

      <main>
        <div className="status">
          <h2>✅ Status: Live</h2>
          <p>This app is deployed from GitHub via Firebase Hosting.</p>
          <ul>
            <li>✓ GitHub Actions CI/CD working</li>
            <li>✓ Firebase Hosting live</li>
            <li>✓ React + Vite bundling correctly</li>
          </ul>
        </div>

        <div className="info">
          <h3>Next Steps:</h3>
          <ol>
            <li>Add Firebase service account secret to GitHub</li>
            <li>Trigger a deploy by pushing a commit</li>
            <li>Watch GitHub Actions workflow run</li>
            <li>Verify changes appear at <code>cybertalks-guest.web.app</code></li>
          </ol>
        </div>

        <footer>
          <p>Built with React, Vite, Firebase, and ❤️</p>
        </footer>
      </main>
    </div>
  )
}

export default App
