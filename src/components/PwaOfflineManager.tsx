'use client';

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  CloudCheck,
  CloudOff,
  Download,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface PwaOfflineManagerProps {
  isSimulatedOffline?: boolean;
  onToggleSimulateOffline?: () => void;
  pendingOfflineCount: number;
  onSyncOfflineQueue: () => void;
}

export default function PwaOfflineManager({
  isSimulatedOffline = false,
  onToggleSimulateOffline,
  pendingOfflineCount,
  onSyncOfflineQueue,
}: PwaOfflineManagerProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [justRestored, setJustRestored] = useState<boolean>(false);

  // Register service worker and listen to online/offline events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      // Register SW
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('KICKSMATE SW Registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('KICKSMATE SW registration failed:', err);
          });
      }

      // Online/Offline events
      const handleOnline = () => {
        setIsOnline(true);
        setJustRestored(true);
        setTimeout(() => setJustRestored(false), 5000);
      };

      const handleOffline = () => {
        setIsOnline(false);
      };

      // PWA Install Prompt
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const effectiveOnline = isOnline && !isSimulatedOffline;

  // Auto trigger sync when back online and items exist
  useEffect(() => {
    if (effectiveOnline && pendingOfflineCount > 0 && !syncing) {
      setSyncing(true);
      setTimeout(() => {
        onSyncOfflineQueue();
        setSyncing(false);
      }, 1200);
    }
  }, [effectiveOnline, pendingOfflineCount, syncing, onSyncOfflineQueue]);

  return (
    <>
      {/* Offline Status Warning Bar (Appears when connection lost or simulated) */}
      {!effectiveOnline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-700 flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5 text-amber-200" />
            </div>
            <div>
              <span className="font-bold">Mode Kasir Offline Aktif</span>
              <span className="font-normal text-amber-100 ml-1.5 hidden sm:inline">
                • Koneksi internet terputus. Kasir POS tetap dapat memproses checkout & cetak struk secara lokal.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingOfflineCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-800 text-amber-100 font-mono text-[10px]">
                {pendingOfflineCount} transaksi tersimpan lokal
              </span>
            )}
            {onToggleSimulateOffline && (
              <button
                type="button"
                onClick={onToggleSimulateOffline}
                className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Pulihkan Koneksi
              </button>
            )}
          </div>
        </div>
      )}

      {/* Online Restored Notification */}
      {justRestored && effectiveOnline && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-200" />
            <span>Koneksi Internet Pulih! Sinkronisasi otomatis ke cloud aktif.</span>
          </div>
        </div>
      )}

      {/* Syncing Indicator floating pill */}
      {syncing && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in-50">
          <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>Menyinkronkan data transaksi offline ke cloud...</span>
        </div>
      )}

      {/* Install PWA Prompt Banner (if browser triggers installability) */}
      {isInstallable && (
        <div className="fixed bottom-6 left-6 z-40 bg-slate-900 border border-slate-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-sm">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white leading-tight">Pasang Aplikasi Kasir</p>
            <p className="text-[11px] text-slate-400">Install KICKSMATE di iPad / Desktop kasir untuk akses offline instan.</p>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Install
          </button>
        </div>
      )}
    </>
  );
}
