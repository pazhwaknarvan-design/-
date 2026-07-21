/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileSpreadsheet, 
  Settings, 
  LogOut, 
  Globe,
  Briefcase,
  X
} from 'lucide-react';
import { ActiveTab, Language, User } from '../types';
import { translations } from '../utils/translations';
import KaraLogo from './KaraLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  user,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const t = translations[lang];
  const isRtl = lang === 'fa';

  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'drive' as ActiveTab, label: t.driveManager, icon: FolderOpen },
    { id: 'sheets' as ActiveTab, label: t.sheetsAnalyzer, icon: FileSpreadsheet },
    { id: 'settings' as ActiveTab, label: t.settings, icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className={`hidden md:flex w-72 flex-col justify-between h-full bg-[#1e020e]/65 backdrop-blur-md ${isRtl ? 'border-l' : 'border-r'} border-[#e5b85a]/15 flex-shrink-0`}>
      {/* Upper Brand Section */}
      <div>
        <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-[#1e020e]/30">
          <KaraLogo size="sm" showText={false} />
          <div>
            <h1 className="font-black text-sm md:text-base tracking-tight text-white font-sans">{t.appName}</h1>
            <span className="text-[8px] md:text-[9px] text-[#e5b85a]/80 font-mono tracking-widest uppercase block mt-0.5">v3.0.0 Enterprise</span>
          </div>
        </div>

        {/* User Profile info if logged in */}
        {user && (
          <div className="px-6 py-4 border-b border-white/10 bg-[#9d1c52]/5 flex items-center gap-3">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-9 h-9 rounded-full border border-[#e5b85a]/40"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9d1c52] to-[#c22d6d] border border-[#e5b85a]/30 flex items-center justify-center text-[#e5b85a] font-bold text-xs">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-[10px] text-rose-200/40">{t.welcome}</p>
              <h2 className="text-xs font-semibold truncate text-white" title={user.displayName || ''}>
                {user.displayName || user.email}
              </h2>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#9d1c52]/15 text-white shadow-inner font-bold border-r-2 border-[#e5b85a]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#e5b85a]' : 'text-white/50'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls: Language & Sign Out */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-[#9d1c52]/5">
        {/* Language selector */}
        <div className="flex items-center justify-between px-2 text-[11px] text-rose-200/50">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-rose-300/40" />
            <span>{t.languageSelection}</span>
          </div>
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10 font-mono">
            <button
              onClick={() => setLang('fa')}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-all cursor-pointer ${
                lang === 'fa' 
                  ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/20 font-bold shadow' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              FA
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-md text-[10px] transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/20 font-bold shadow' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-medium border border-white/10 bg-white/5 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5" />
            {t.signOutBtn}
          </span>
        </button>
      </div>
    </aside>

    {/* Mobile Sidebar overlay backdrop */}
    {isMobileOpen && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 animate-in fade-in"
        onClick={onCloseMobile}
      >
        {/* Drawer container */}
        <div 
          className={`fixed top-0 bottom-0 w-72 max-w-[85vw] bg-[#1a020c] z-50 flex flex-col justify-between border-y border-[#e5b85a]/15 shadow-2xl p-0 transition-transform duration-300 animate-in slide-in-from-left
            ${isRtl ? 'right-0 border-l border-[#e5b85a]/15' : 'left-0 border-r border-[#e5b85a]/15'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {/* Header with close button */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1e020e]/30">
              <div className="flex items-center gap-2.5">
                <KaraLogo size="sm" showText={false} />
                <div>
                  <h1 className="font-black text-sm text-white font-sans">{t.appName}</h1>
                  <span className="text-[8px] text-[#e5b85a]/80 font-mono tracking-wider">v3.0.0 Enterprise</span>
                </div>
              </div>
              <button 
                onClick={onCloseMobile}
                className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User profile */}
            {user && (
              <div className="px-4 py-3 border-b border-white/10 bg-[#9d1c52]/5 flex items-center gap-2.5">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-[#e5b85a]/40"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9d1c52] to-[#c22d6d] border border-[#e5b85a]/30 flex items-center justify-center text-[#e5b85a] font-bold text-xs">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-[9px] text-rose-200/40">{t.welcome}</p>
                  <h2 className="text-xs font-semibold truncate text-white">
                    {user.displayName || user.email}
                  </h2>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <nav className="p-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onCloseMobile?.();
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#9d1c52]/15 text-white font-bold border-r-2 border-[#e5b85a]'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e5b85a]' : 'text-white/50'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer controls */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#9d1c52]/5">
            {/* Language selector */}
            <div className="flex items-center justify-between px-1 text-[10px] text-rose-200/50">
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-rose-300/40" />
                <span>{t.languageSelection}</span>
              </div>
              <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10 font-mono">
                <button
                  onClick={() => setLang('fa')}
                  className={`px-1.5 py-0.5 rounded text-[9px] transition-all cursor-pointer ${
                    lang === 'fa' 
                      ? 'bg-[#9d1c52] text-white font-bold shadow' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  FA
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-1.5 py-0.5 rounded text-[9px] transition-all cursor-pointer ${
                    lang === 'en' 
                      ? 'bg-[#9d1c52] text-white font-bold shadow' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={() => {
                onLogout();
                onCloseMobile?.();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[10px] font-medium border border-white/10 bg-white/5 text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" />
                {t.signOutBtn}
              </span>
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
