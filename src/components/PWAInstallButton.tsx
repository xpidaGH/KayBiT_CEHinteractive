import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, Apple, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2 py-1">
        <CheckCircle2 size={13} />
        <span>Installed Native PWA</span>
      </span>
    );
  }

  if (deferredPrompt) {
    return (
      <button
        id="btn-pwa-install"
        onClick={handleInstall}
        className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 fw-semibold"
        title="Install KayBiT_CEHinteractive as standalone desktop/mobile app"
      >
        <Download size={14} />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-ios-pwa-guide"
          onClick={() => setShowIOSGuide(true)}
          className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
        >
          <Apple size={14} />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-light border border-secondary">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Apple size={18} className="text-info" />
                    Install on iPhone or iPad
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowIOSGuide(false)} />
                </div>
                <div className="modal-body">
                  <ol className="small text-secondary ps-3 mb-0 lh-lg">
                    <li>Open this app in <strong>Safari</strong> on your iOS device.</li>
                    <li>Tap the <strong>Share</strong> button (box with an arrow pointing up).</li>
                    <li>Scroll down and select <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>"Add"</strong> in the upper-right corner.</li>
                  </ol>
                </div>
                <div className="modal-footer border-secondary">
                  <button className="btn btn-info btn-sm" onClick={() => setShowIOSGuide(false)}>Got it</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
