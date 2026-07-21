/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Globe, 
  Key, 
  Info, 
  Copy, 
  Check, 
  Terminal, 
  Database,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../utils/translations';

interface SettingsProps {
  lang: Language;
  setLang: (lang: Language) => void;
  accessToken: string | null;
  user: User | null;
}

export default function SettingsComponent({
  lang,
  setLang,
  accessToken,
  user,
}: SettingsProps) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    if (!accessToken) return;
    navigator.clipboard.writeText(accessToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
          {t.settings}
        </h2>
        <p className="text-sm text-white/60 mt-1 font-sans">
          {lang === 'fa' ? 'پیکربندی هویت سازمانی و توکنهای متصل به سیستم کارا ERP' : 'Configure enterprise settings, languages, and security keys'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Selection Card */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-sans">
              <Globe className="w-5 h-5 text-[#e5b85a]" />
              {t.languageSelection}
            </h3>
            <p className="text-xs text-white/40 mb-4 font-sans">
              {lang === 'fa' ? 'زبان پیشفرض واسط کاربری سامانه کارا را انتخاب کنید.' : 'Choose the interface layout and translation for KARA ERP.'}
            </p>
            <div className="flex gap-4 font-sans">
              <button
                onClick={() => setLang('fa')}
                className={`flex-1 p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  lang === 'fa'
                    ? 'border-[#e5b85a]/40 bg-[#9d1c52]/20 text-[#e5b85a] font-bold shadow-md'
                    : 'border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <span className="block text-lg mb-1">🇮🇷</span>
                <span className="text-sm block">فارسی (RTL)</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={`flex-1 p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'border-[#e5b85a]/40 bg-[#9d1c52]/20 text-[#e5b85a] font-bold shadow-md'
                    : 'border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                <span className="block text-lg mb-1">🇺🇸</span>
                <span className="text-sm block">English (LTR)</span>
              </button>
            </div>
          </div>

          {/* Active OAuth Token Card */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2 font-sans">
              <Key className="w-5 h-5 text-[#e5b85a]" />
              {t.activeToken}
            </h3>
            <p className="text-xs text-white/40 mb-4 font-sans">
              {lang === 'fa' 
                ? 'توکن دسترسی صادر شده توسط حساب کاربری گوگل جهت امضای درخواستهای وبسایت شما' 
                : 'Session token issued by Google APIs to authorize drive and spreadsheet requests.'
              }
            </p>
            
            {accessToken ? (
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl font-mono text-[10px] break-all text-white/70 select-all max-h-24 overflow-y-auto leading-relaxed">
                  {accessToken}
                </div>
                <button
                  onClick={handleCopyToken}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#9d1c52] hover:bg-[#9d1c52]/85 border border-[#e5b85a]/30 text-white rounded-lg transition active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copied : t.copyToken}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl">
                {lang === 'fa' ? 'هیچ توکن دسترسی ابری فعالی یافت نشد' : 'No active session token available.'}
              </div>
            )}
          </div>
        </div>

        {/* Info & Metadata Column */}
        <div className="space-y-6">
          {/* About Card */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2 font-sans">
              <Info className="w-5 h-5 text-[#e5b85a]" />
              {t.aboutTitle}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans mb-4">
              {t.aboutText}
            </p>
            <div className="pt-4 border-t border-white/5 space-y-2.5 text-[11px] font-semibold text-white/50 font-sans">
              <div className="flex justify-between">
                <span>{t.erpVersion}:</span>
                <span className="font-mono text-white">3.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'fa' ? 'فناوری توسعه:' : 'Tech Stack:'}</span>
                <span className="font-mono text-[#e5b85a]">React 19 + Tailwind v4</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'fa' ? 'شناسه کاربر:' : 'User ID:'}</span>
                <span className="font-mono text-white truncate max-w-[140px]" title={user?.uid || ''}>{user?.uid || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Card */}
          <div className="glass-card rounded-2xl p-6 text-white/80">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              KARA SYSTEM COMPLIANCE
            </h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-white/40 flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#e5b85a]" />
                  DATABASE_STATE
                </span>
                <span className="text-emerald-400 font-bold">MUTABLE_GOOGLE_CLOUD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#e5b85a]" />
                  AUTH_STATE
                </span>
                <span className="text-emerald-400 font-bold">FIREBASE_POPUP_OK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-[#e5b85a]" />
                  SECURE_GATEWAY
                </span>
                <span className="text-emerald-400 font-bold">SSL_AES_256</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
