// InstallBanner.tsx — Place in src/components/InstallBanner.tsx
// Shows "Add to Home Screen" prompt + offline indicator

import { usePWA } from "../hooks/usePWA";

export default function InstallBanner() {
  const { installPrompt, isInstalled, isOnline, triggerInstall } = usePWA();

  return (
    <>
      {/* Offline warning bar */}
      {!isOnline && (
        <div className="offline-bar">
          <span>⚡</span>
          <span>You're offline — NyaySwarm needs internet to answer queries. Call NALSA: <strong>15100</strong></span>
        </div>
      )}

      {/* Install prompt — only show if not installed and prompt available */}
      {!isInstalled && installPrompt && (
        <div className="install-banner">
          <div className="install-banner-left">
            <div className="install-icon">⚖</div>
            <div>
              <div className="install-title">Install NyaySwarm</div>
              <div className="install-sub">Add to home screen — works like a native app, no Play Store needed</div>
            </div>
          </div>
          <div className="install-actions">
            <button className="install-btn-primary" onClick={triggerInstall}>
              Install Free →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
