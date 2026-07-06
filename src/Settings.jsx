import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronDown, Globe, Power, Zap, RotateCw, Activity, Pin,
  AlertTriangle, Check, Wrench, Bell, Shield, Settings as SettingsIcon
} from 'lucide-react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { invoke } from '@tauri-apps/api/core';
import { getTranslations } from './i18n';
import { CHUNK_SIZES, DEFAULT_CHUNKS } from './profiles';
import './App.css';

const Toggle = ({ checked, onChange }) => (
  <div 
    className={`v2-toggle ${checked ? 'active' : ''}`}
    onClick={(e) => {
      e.stopPropagation();
      onChange(!checked);
    }}
  >
    <div className="v2-toggle-thumb" />
  </div>
);

const Settings = ({ onBack, config, updateConfig, dnsLatencies, setDnsLatencies }) => {
  const scrollRef = useRef(null);

  const [expandedISP, setExpandedISP] = useState(null);
  const [driverInstalled, setDriverInstalled] = useState(false);
  const [needsRestart, setNeedsRestart] = useState(false);
  const [showNpcapDetails, setShowNpcapDetails] = useState(false);

  useEffect(() => {
    invoke('check_driver').then(setDriverInstalled);
  }, []);

  const latencies = dnsLatencies || {};
  const setLatencies = setDnsLatencies || (() => {});
  const [isChecking, setIsChecking] = useState(false);
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const [sortedProviders, setSortedProviders] = useState([]);
  const [fixStatus, setFixStatus] = useState('idle');

  const t = getTranslations('tr');

  const DNS_PROVIDERS = useMemo(() => [
    { id: 'cloudflare', name: 'Cloudflare', desc: t.dnsCfDesc, ip: '1.1.1.1' },
    { id: 'adguard', name: 'AdGuard', desc: t.dnsAdguardDesc, ip: '94.140.14.14' },
    { id: 'google', name: 'Google', desc: t.dnsGoogleDesc, ip: '8.8.8.8' },
    { id: 'quad9', name: 'Quad9', desc: t.dnsQuad9Desc, ip: '9.9.9.9' },
    { id: 'opendns', name: 'OpenDNS', desc: t.dnsOpenDnsDesc, ip: '208.67.222.222' }
  ], [t]);

  useEffect(() => {
    if (Object.keys(latencies).length > 0) {
      const sorted = [...DNS_PROVIDERS].sort((a, b) => (latencies[a.id] || 999) - (latencies[b.id] || 999));
      setSortedProviders(sorted);
    } else {
      setSortedProviders(DNS_PROVIDERS);
    }
  }, [latencies, DNS_PROVIDERS]);

  useEffect(() => {
    checkAutostart();
  }, []);

  const checkAutostart = async () => {
    try {
      const active = await isEnabled();
      setAutostartEnabled(active);
    } catch (e) {
      console.error('Autostart check failed:', e);
    }
  };

  const toggleAutostart = async (val) => {
    try {
      if (val) {
        await enable();
      } else {
        await disable();
      }
      setAutostartEnabled(val);
      updateConfig('autoStart', val);
    } catch (e) {
      console.error('Autostart toggle failed:', e);
    }
  };

  const checkAllLatencies = async (forceSelectBest = false) => {
    setIsChecking(true);
    const newLatencies = {};
    const pingableProviders = DNS_PROVIDERS.filter(p => p.ip !== null);
    
    const results = await Promise.allSettled(
      pingableProviders.map(async (provider) => {
        try {
          const latency = await invoke('check_dns_latency', { dnsIp: provider.ip });
          return { id: provider.id, latency };
        } catch (e) {
          console.error(`Ping failed for ${provider.name}:`, e);
          return { id: provider.id, latency: 999 };
        }
      })
    );

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        newLatencies[result.value.id] = result.value.latency;
      }
    });
    
    setLatencies(newLatencies);
    
    const systemDns = DNS_PROVIDERS.find(p => p.id === 'system');
    const otherDns = DNS_PROVIDERS.filter(p => p.id !== 'system').sort((a, b) => 
      (newLatencies[a.id] || 999) - (newLatencies[b.id] || 999)
    );
    
    const sorted = systemDns ? [systemDns, ...otherDns] : otherDns;
    setSortedProviders(sorted);
    
    if (forceSelectBest || config.dnsMode === 'auto') {
      const bestDns = otherDns[0];
      if (bestDns) {
        updateConfig('selectedDns', bestDns.id);
      }
    }

    setIsChecking(false);
  };

  const handleFixInternet = async () => {
    if (fixStatus === 'fixing') return;
    setFixStatus('fixing');
    try {
      await invoke('clear_system_proxy');
      window.dispatchEvent(new CustomEvent('beni-iceri-al-DPI-force-disconnect', {
        detail: { reason: 'manual-fix' }
      }));
      setFixStatus('fixed');
      setTimeout(() => setFixStatus('idle'), 2000);
    } catch (e) {
      console.error('Fix failed:', e);
      setFixStatus('error');
      setTimeout(() => setFixStatus('idle'), 2000);
    }
  };

  return (
    <div className="v2-settings-overlay">
      {/* Header */}
      <div className="v2-settings-header">
        <button className="v2-back-btn" onClick={onBack}>
          <ChevronLeft size={28} />
        </button>
        <h1>{t.settingsTitle}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="v2-settings-content" ref={scrollRef}>
        
        {/* ========== BAĞLANTI & DPI AYARLARI ========== */}
        <div className="v2-section">
          <div className="v2-section-title">{t.sectionBypass}</div>
          <div className="v2-card">
            {/* Turbo Mod */}
            <div 
              className={`v2-item hover-effect ${config.dpiMethod === '0' ? 'v2-selected' : ''}`}
              style={{ background: config.dpiMethod === '0' ? 'rgba(234, 179, 8, 0.1)' : 'transparent', opacity: config.dpiMethod === '0' ? 1 : 0.5, cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => { updateConfig({ dpiMethod: '0', httpsChunkSize: 4, selectedIspProfile: 'custom' }); }}
            >
              <div className="v2-icon yellow" style={{ background: config.dpiMethod === '0' ? 'rgba(234, 179, 8, 0.2)' : '' }}>
                <Activity size={20} className={config.dpiMethod === '0' ? 'active-icon' : ''} />
              </div>
              <div className="v2-item-text">
                <h3 style={{ color: config.dpiMethod === '0' ? '#facc15' : '' }}>{t.modeTurboName}</h3>
                <p>{t.modeTurboDesc}</p>
              </div>
              <div className={`v2-radio ${config.dpiMethod === '0' ? 'on' : ''}`}>
                 {config.dpiMethod === '0' && <div className="v2-radio-dot" />}
              </div>
            </div>

            <div className="v2-divider" />

            {/* Dengeli Mod */}
            <div 
              className={`v2-item hover-effect ${config.dpiMethod === '1' ? 'v2-selected' : ''}`}
              style={{ background: config.dpiMethod === '1' ? 'rgba(34, 197, 94, 0.1)' : 'transparent', opacity: config.dpiMethod === '1' ? 1 : 0.5, cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => { updateConfig({ dpiMethod: '1', httpsChunkSize: 2, selectedIspProfile: 'custom' }); }}
            >
              <div className="v2-icon green" style={{ background: config.dpiMethod === '1' ? 'rgba(34, 197, 94, 0.2)' : '' }}>
                <Zap size={20} className={config.dpiMethod === '1' ? 'active-icon' : ''} />
              </div>
              <div className="v2-item-text">
                <h3 style={{ color: config.dpiMethod === '1' ? '#4ade80' : '' }}>{t.modeBalancedName}</h3>
                <p>{t.modeBalancedDesc}</p>
              </div>
              <div className={`v2-radio ${config.dpiMethod === '1' ? 'on' : ''}`}>
                 {config.dpiMethod === '1' && <div className="v2-radio-dot" />}
              </div>
            </div>

            <div className="v2-divider" />

            {/* Güçlü Mod */}
            <div 
              className={`v2-item hover-effect ${config.dpiMethod === '2' ? 'v2-selected' : ''}`}
              style={{ 
                background: config.dpiMethod === '2' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                opacity: config.dpiMethod === '2' ? 1 : 0.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => { updateConfig({ dpiMethod: '2', httpsChunkSize: 1, selectedIspProfile: 'custom' }); }}
            >
              <div className="v2-icon blue" style={{ background: config.dpiMethod === '2' ? 'rgba(59, 130, 246, 0.2)' : '' }}>
                <Shield size={20} className={config.dpiMethod === '2' ? 'active-icon' : ''} />
              </div>
              <div className="v2-item-text">
                <h3 style={{ color: config.dpiMethod === '2' ? '#60a5fa' : '' }}>{t.modeStrongName}</h3>
                <p>{t.modeStrongDesc}</p>
              </div>
              <div className={`v2-radio ${config.dpiMethod === '2' ? 'on' : ''}`}>
                 {config.dpiMethod === '2' && <div className="v2-radio-dot" />}
              </div>
            </div>

            {/* Advanced features (Npcap) */}
            <AnimatePresence>
              {config.dpiMethod === '2' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="v2-divider" />
                  {driverInstalled ? (
                    <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="v2-item" style={{ padding: 0 }}>
                        <div className="v2-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', width: '32px', height: '32px', minWidth: '32px' }}>
                          <Shield size={16} />
                        </div>
                        <div className="v2-item-text">
                          <h3 style={{ color: config.advancedBypass !== false ? '#d8b4fe' : '', fontSize: '0.85rem' }}>{t.advancedFeaturesToggle}</h3>
                          <p style={{ fontSize: '0.7rem' }}>{t.advancedFeaturesToggleDesc}</p>
                        </div>
                        <Toggle checked={config.advancedBypass !== false} onChange={(v) => updateConfig('advancedBypass', v)} />
                      </div>
                      {needsRestart && (
                        <div style={{ 
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 10px', borderRadius: '6px',
                          background: 'rgba(251, 146, 60, 0.08)', 
                          border: '1px solid rgba(251, 146, 60, 0.15)'
                        }}>
                          <AlertTriangle size={12} color="#fb923c" />
                          <span style={{ fontSize: '0.65rem', color: '#fb923c', fontWeight: 500 }}>
                            {t.npcapRestartWarning}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '6px 16px 10px' }}>
                      <div 
                        onClick={() => setShowNpcapDetails(!showNpcapDetails)}
                        style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px', 
                          cursor: 'pointer', padding: '5px 10px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.06)',
                          border: '1px solid rgba(245, 158, 11, 0.12)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Zap size={11} color="#f59e0b" />
                        <span style={{ fontSize: '0.68rem', color: '#d4a14a', fontWeight: 500 }}>
                          {t.advancedNpcapHint}
                        </span>
                        <ChevronDown size={11} color="#d4a14a" style={{ 
                          transform: showNpcapDetails ? 'rotate(180deg)' : 'rotate(0)', 
                          transition: 'transform 0.2s',
                          marginLeft: '2px'
                        }} />
                      </div>

                      <AnimatePresence>
                        {showNpcapDetails && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t.advancedNpcapWhy}</p>
                              <button 
                                onClick={async () => {
                                  try {
                                    await invoke('install_driver');
                                    const installed = await invoke('check_driver');
                                    setDriverInstalled(installed);
                                    if (installed) setNeedsRestart(true);
                                  } catch (e) {
                                    console.error('Driver install failed:', e);
                                  }
                                }} 
                                style={{ 
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                  color: '#000', border: 'none', padding: '8px 12px', borderRadius: '8px', 
                                  fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  gap: '6px', width: '100%', textTransform: 'uppercase', letterSpacing: '0.5px',
                                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                                }}
                              >
                                <Wrench size={13} />
                                {t.advancedNpcapInstallBtn}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chunk Size selector */}
            {(config.dpiMethod === '1' || config.dpiMethod === '2') && (
              <>
                <div className="v2-divider" />
                <div style={{ display: 'flex', width: '100%', padding: '6px 12px', boxSizing: 'border-box' }}>
                  {CHUNK_SIZES.map((opt) => {
                    const fallbackChunk = DEFAULT_CHUNKS[config.dpiMethod] || 2;
                    const isSelected = Number(config.httpsChunkSize || fallbackChunk) === opt.value;
                    const accentColor = config.dpiMethod === '2' ? '#60a5fa' : '#4ade80';
                    const accentBg = config.dpiMethod === '2' ? 'rgba(59, 130, 246, 0.18)' : 'rgba(34, 197, 94, 0.18)';
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateConfig({ httpsChunkSize: opt.value, selectedIspProfile: 'custom' })}
                        style={{
                          flex: 1, height: '32px', border: 'none', margin: '0 4px', borderRadius: '6px',
                          background: isSelected ? accentBg : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? accentColor : '#94a3b8',
                          fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========== OTOMASYON & SİSTEM GENEL AYARLARI ========== */}
        <div className="v2-section">
          <div className="v2-section-title">{t.sectionAutomation}</div>
          <div className="v2-card">
            <div className="v2-item">
              <div className="v2-icon yellow"><Zap size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.autoConnect}</h3>
                <p>{t.autoConnectDesc}</p>
              </div>
              <Toggle checked={config.autoConnect} onChange={(v) => updateConfig('autoConnect', v)} />
            </div>

            <div className="v2-divider" />

            <div className="v2-item">
              <div className="v2-icon green"><RotateCw size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.autoReconnect}</h3>
                <p>{t.autoReconnectDesc}</p>
              </div>
              <Toggle checked={config.autoReconnect} onChange={(v) => updateConfig('autoReconnect', v)} />
            </div>

            <div className="v2-divider" />

            <div className="v2-item">
              <div className="v2-icon green"><Power size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.autoStart}</h3>
                <p>{t.autoStartDesc}</p>
              </div>
              <Toggle checked={autostartEnabled} onChange={toggleAutostart} />
            </div>

            <div className="v2-divider" />

            <div className="v2-item">
              <div className="v2-icon gray"><ChevronLeft size={20} style={{transform:'rotate(-90deg)'}} /></div>
              <div className="v2-item-text">
                <h3>{t.minimizeToTray}</h3>
                <p>{t.minimizeToTrayDesc}</p>
              </div>
              <Toggle checked={config.minimizeToTray} onChange={(v) => updateConfig('minimizeToTray', v)} />
            </div>

            <div className="v2-divider" />

            <div className="v2-item">
              <div className="v2-icon blue"><Pin size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.alwaysOnTop || 'Her Şeyin Üzerinde Tut'}</h3>
                <p>{t.alwaysOnTopDesc || 'Pencere her zaman diğer pencerelerin üzerinde kalır'}</p>
              </div>
              <Toggle checked={config.alwaysOnTop || false} onChange={(v) => updateConfig('alwaysOnTop', v)} />
            </div>

            <div className="v2-divider" />

            <div className="v2-item">
              <div className="v2-icon yellow" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}><AlertTriangle size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.requireConfirmation}</h3>
                <p>{t.requireConfirmationDesc}</p>
              </div>
              <Toggle checked={config.requireConfirmation !== false} onChange={(v) => updateConfig('requireConfirmation', v)} />
            </div>
          </div>
        </div>

        {/* ========== DNS AYARLARI ========== */}
        <div className="v2-section">
          <div className="v2-section-title">{t.sectionDns}</div>
          <div className="v2-card">
            <div className="v2-item">
              <div className="v2-item-text">
                <h3>{t.dnsAutoSelect}</h3>
                <p>{t.dnsAutoSelectDesc}</p>
              </div>
              <Toggle 
                checked={config.dnsMode === 'auto'} 
                onChange={(v) => {
                  updateConfig('dnsMode', v ? 'auto' : 'manual');
                  if (v) checkAllLatencies(true); 
                }} 
              />
            </div>

            <div style={{ padding: '0 16px 16px 16px' }}>
              <button 
                onClick={checkAllLatencies} 
                disabled={isChecking}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: isChecking ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)',
                  color: isChecking ? '#93c5fd' : '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  padding: '10px 0',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: isChecking ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isChecking ? <RotateCw size={16} className="spin" /> : <Activity size={16} />}
                {isChecking ? t.dnsChecking : t.dnsCheckSpeed}
              </button>
            </div>

            <div className="v2-divider" style={{ margin: 0 }} />

            <div className="v2-dns-list">
              <AnimatePresence>
                {sortedProviders.map((p) => {
                  const isSelected = config.selectedDns === p.id;
                  const isAutoMode = config.dnsMode === 'auto';
                  const isDisabled = isAutoMode;
                  return (
                    <motion.div 
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: isDisabled 
                          ? (isSelected ? 1 : 0.5) 
                          : (!isSelected ? 0.45 : 1),
                        y: 0 
                      }}
                      whileHover={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`v2-dns-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isDisabled) return;
                        updateConfig('selectedDns', p.id);
                      }}
                    >
                      <div className={`v2-radio ${isSelected ? 'on' : ''}`}>
                        {isSelected && <div className="v2-radio-dot" />}
                      </div>
                      <div className="v2-dns-info">
                        <span className="v2-dns-name">{p.name}</span>
                        <span className="v2-dns-desc">{p.desc}</span>
                      </div>
                      {latencies[p.id] && (
                        <div className="v2-latency">{latencies[p.id]}ms</div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========== BİLDİRİM AYARLARI ========== */}
        <div className="v2-section">
          <div className="v2-section-title">{t.sectionNotifications}</div>
          <div className="v2-card">
            <div className="v2-item">
              <div className="v2-icon blue" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}><Bell size={20} /></div>
              <div className="v2-item-text">
                <h3>{t.notifications}</h3>
                <p>{t.notificationsDesc}</p>
              </div>
              <Toggle checked={config.notifications !== false} onChange={(v) => updateConfig('notifications', v)} />
            </div>

            <div className="v2-divider" />

            <div 
              className="v2-item hover-effect"
              style={{
                opacity: config.notifications !== false ? 1 : 0.4,
                pointerEvents: config.notifications !== false ? 'auto' : 'none',
                transition: 'opacity 0.2s ease',
                paddingLeft: '1.5rem'
              }}
              onClick={() => {
                 if (config.notifications !== false) {
                    updateConfig('notifyOnConnect', config.notifyOnConnect !== false ? false : true);
                 }
              }}
            >
              <div className="v2-icon green">
                 <Check size={18} />
              </div>
              <div className="v2-item-text">
                <h3 style={{ fontSize: '0.85rem' }}>{t.notifyOnConnect}</h3>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{t.notifyOnConnectDesc}</p>
              </div>
              <Toggle checked={config.notifyOnConnect !== false} onChange={(v) => updateConfig('notifyOnConnect', v)} />
            </div>

            <div className="v2-divider" style={{ marginLeft: '3.5rem' }} />

            <div 
              className="v2-item hover-effect"
              style={{
                opacity: config.notifications !== false ? 1 : 0.4,
                pointerEvents: config.notifications !== false ? 'auto' : 'none',
                transition: 'opacity 0.2s ease',
                paddingLeft: '1.5rem'
              }}
              onClick={() => {
                 if (config.notifications !== false) {
                    updateConfig('notifyOnDisconnect', config.notifyOnDisconnect !== false ? false : true);
                 }
              }}
            >
              <div className="v2-icon yellow" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
                 <AlertTriangle size={18} />
              </div>
              <div className="v2-item-text">
                <h3 style={{ fontSize: '0.85rem' }}>{t.notifyOnDisconnect}</h3>
                <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{t.notifyOnDisconnectDesc}</p>
              </div>
              <Toggle checked={config.notifyOnDisconnect !== false} onChange={(v) => updateConfig('notifyOnDisconnect', v)} />
            </div>
          </div>
        </div>

        {/* ========== SORUN GİDERME & İNTERNETİ ONAR ========== */}
        <div className="v2-section">
          <div className="v2-section-title">{t.sectionTroubleshoot}</div>
          <div className="v2-card" style={{ 
            background: fixStatus === 'fixing' ? '#b45309' : fixStatus === 'fixed' ? '#10b981' : fixStatus === 'error' ? '#ef4444' : '#002c1dff', 
            border: 'none',
            transition: 'all 0.4s ease'
          }}>
            <div className="v2-item hover-effect" onClick={handleFixInternet} style={{cursor: fixStatus === 'idle' ? 'pointer' : 'default'}}>
               <div className="v2-icon" style={{ 
                 color: fixStatus === 'fixing' ? '#b45309' : fixStatus === 'fixed' ? '#10b981' : fixStatus === 'error' ? '#ef4444' : '#10b981', 
                 background: '#ffffff',
                 transition: 'all 0.4s ease'
               }}>
                 <Wrench size={20} className={fixStatus === 'fixing' ? 'spinning-slow' : ''} />
               </div>
                <div className="v2-item-text">
                  <h3 style={{ color: '#ffffff', transition: 'all 0.4s ease' }}>
                    {fixStatus === 'fixing' ? t.fixRepairing : fixStatus === 'fixed' ? t.fixDone : fixStatus === 'error' ? t.fixError : t.fixInternet}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.82)', transition: 'all 0.4s ease' }}>
                    {fixStatus === 'fixing' ? t.fixRepairingDesc : fixStatus === 'fixed' ? t.fixDoneDesc : fixStatus === 'error' ? t.fixErrorDesc : t.fixInternetDesc}
                  </p>
                </div>
               <div style={{ padding: '0 0.5rem' }}>
                 {fixStatus === 'fixing' && <RotateCw size={20} className="spinning" color="#ffffff" />}
                 {fixStatus === 'fixed' && <Check size={24} color="#ffffff" />}
                 {fixStatus === 'error' && <AlertTriangle size={24} color="#ffffff" />}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
