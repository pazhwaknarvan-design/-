/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Globe, 
  Loader2, 
  AlertTriangle,
  Menu
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from './lib/firebase';
import { 
  listDriveFiles, 
  createDriveFolder, 
  createSpreadsheet, 
  uploadFileToDrive, 
  deleteDriveFile 
} from './lib/drive';
import { 
  getSpreadsheetMetadata, 
  getSheetValues, 
  appendSheetRow, 
  initializeErpLedger 
} from './lib/sheets';
import { 
  ActiveTab, 
  Language, 
  DriveFile, 
  SpreadsheetData, 
  User 
} from './types';
import { translations } from './utils/translations';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DriveManager from './components/DriveManager';
import SheetsManager from './components/SheetsManager';
import SettingsComponent from './components/Settings';
import KaraLogo from './components/KaraLogo';

export default function App() {
  // Localization state
  const [lang, setLang] = useState<Language>('fa');
  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState('');

  // App active tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Mobile UI Sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Google Drive & Sheets states
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<DriveFile[]>([]);
  const [sheetData, setSheetData] = useState<SpreadsheetData | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Initialize Auth state listener on app mount
  useEffect(() => {
    const unsubscribe = initAuth(
      async (authUser, accessToken) => {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
        });
        setToken(accessToken);
        setNeedsAuth(false);
        setAuthLoading(false);
        
        // Immediately fetch user files
        loadUserCloudData(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch file list from Google Drive
  const loadUserCloudData = async (accessToken: string) => {
    setApiLoading(true);
    setAuthError(null);
    try {
      const driveFiles = await listDriveFiles(accessToken);
      setFiles(driveFiles);
      
      // Filter for spreadsheets
      const sheetsList = driveFiles.filter(
        (f) => f.mimeType === 'application/vnd.google-apps.spreadsheet'
      );
      setSpreadsheets(sheetsList);
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setAuthError(err.message || 'Failed to sync with Google Drive');
    } finally {
      setApiLoading(false);
    }
  };

  // Sign In Handler
  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
        setToken(result.accessToken);
        setNeedsAuth(false);
        await loadUserCloudData(result.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setAuthError(err.message || 'OAuth sign-in process cancelled or failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Demo Sandbox Login Handler
  const handleSandboxLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      setUser({
        uid: 'demo-user-123',
        email: 'demo@karaerp.local',
        displayName: lang === 'fa' ? 'مهمان آزمایشی (Demo Guest)' : 'Demo Guest',
        photoURL: null,
      });
      setToken('DEMO_TOKEN');
      setNeedsAuth(false);
      await loadUserCloudData('DEMO_TOKEN');
    } catch (err: any) {
      console.error('Demo login failed:', err);
      setAuthError(err.message || 'Failed to start Sandbox mode.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Developer Manual Token Login Handler
  const handleManualTokenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      setUser({
        uid: 'dev-user-pasted',
        email: 'developer@workspace.api',
        displayName: lang === 'fa' ? 'توسعه‌دهنده (Manual Token)' : 'Developer Token',
        photoURL: null,
      });
      setToken(manualToken.trim());
      setNeedsAuth(false);
      await loadUserCloudData(manualToken.trim());
    } catch (err: any) {
      console.error('Manual token login failed:', err);
      setAuthError(err.message || 'Invalid or expired manual token.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Out Handler
  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setFiles([]);
      setSpreadsheets([]);
      setSheetData(null);
      setNeedsAuth(true);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Trigger manual sync refresh
  const handleRefreshSync = async () => {
    if (!token) return;
    await loadUserCloudData(token);
    
    // Refresh active sheet data if any
    if (sheetData) {
      await handleSelectSpreadsheet(sheetData.spreadsheetId, sheetData.title);
    }
  };

  // Upload a local file to Google Drive
  const handleUploadFile = async (file: File) => {
    if (!token) return;
    setApiLoading(true);
    try {
      await uploadFileToDrive(token, file);
      await loadUserCloudData(token);
    } catch (err: any) {
      console.error('File upload error:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Create a new folder in Google Drive
  const handleCreateFolder = async (name: string) => {
    if (!token) return;
    setApiLoading(true);
    try {
      await createDriveFolder(token, name);
      await loadUserCloudData(token);
    } catch (err: any) {
      console.error('Folder creation error:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Create a new Google Spreadsheet
  const handleCreateSpreadsheet = async (title: string) => {
    if (!token) return;
    setApiLoading(true);
    try {
      const newSheetFile = await createSpreadsheet(token, title);
      await loadUserCloudData(token);
      
      // Auto-initialize with standard ERP headers
      await initializeErpLedger(token, newSheetFile.id);
      
      // Select the newly created spreadsheet
      await handleSelectSpreadsheet(newSheetFile.id, title);
      setActiveTab('sheets');
    } catch (err: any) {
      console.error('Spreadsheet creation error:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Delete a document from Google Drive
  const handleDeleteFile = async (fileId: string) => {
    if (!token) return;
    setApiLoading(true);
    try {
      await deleteDriveFile(token, fileId);
      
      // If we deleted the actively loaded spreadsheet, clear active state
      if (sheetData && sheetData.spreadsheetId === fileId) {
        setSheetData(null);
      }
      
      await loadUserCloudData(token);
    } catch (err: any) {
      console.error('File deletion error:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Select a Spreadsheet and Load Sheets tabs
  const handleSelectSpreadsheet = async (id: string, title: string) => {
    if (!token) return;
    setApiLoading(true);
    try {
      const meta = await getSpreadsheetMetadata(token, id);
      
      // Default to loading the first sheet/tab values
      const firstTab = meta.sheets[0] || 'Sheet1';
      const values = await getSheetValues(token, id, firstTab);

      setSheetData({
        spreadsheetId: id,
        title: meta.title,
        sheets: meta.sheets,
        activeSheet: firstTab,
        headers: values.headers,
        rows: values.rows,
      });

      // Jump to the Sheets manager view to see it
      setActiveTab('sheets');
    } catch (err: any) {
      console.error('Error loading spreadsheet:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Switch Sub-sheet Tab
  const handleSelectTab = async (tabName: string) => {
    if (!token || !sheetData) return;
    setApiLoading(true);
    try {
      const values = await getSheetValues(token, sheetData.spreadsheetId, tabName);
      setSheetData({
        ...sheetData,
        activeSheet: tabName,
        headers: values.headers,
        rows: values.rows,
      });
    } catch (err: any) {
      console.error('Error changing tab:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Append a transaction row to Google Sheets
  const handleAddTransaction = async (rowValues: any[]) => {
    if (!token || !sheetData) return;
    setApiLoading(true);
    try {
      await appendSheetRow(token, sheetData.spreadsheetId, sheetData.activeSheet, rowValues);
      
      // Reload active sheet values
      const values = await getSheetValues(token, sheetData.spreadsheetId, sheetData.activeSheet);
      setSheetData({
        ...sheetData,
        headers: values.headers,
        rows: values.rows,
      });
    } catch (err: any) {
      console.error('Error adding transaction:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // Format spreadsheet as an ERP General Ledger
  const handleInitializeLedger = async () => {
    if (!token || !sheetData) return;
    setApiLoading(true);
    try {
      await initializeErpLedger(token, sheetData.spreadsheetId, sheetData.activeSheet);
      
      // Reload values
      const values = await getSheetValues(token, sheetData.spreadsheetId, sheetData.activeSheet);
      setSheetData({
        ...sheetData,
        headers: values.headers,
        rows: values.rows,
      });
    } catch (err: any) {
      console.error('Error formatting ledger:', err);
      throw err;
    } finally {
      setApiLoading(false);
    }
  };

  // --- RENDERING ROUTER ---

  // Loading Screen (Auth Check)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1a020c] flex flex-col items-center justify-center text-white" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="mb-6">
          <KaraLogo size="lg" showText={true} showSubtitle={true} className="animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-[#e5b85a] font-sans tracking-widest uppercase mt-4">
          {lang === 'fa' ? 'در حال برقراری ارتباط ایمن با سرور...' : 'Establishing secure system bridge...'}
        </p>
      </div>
    );
  }

  // Auth Splash / Login Screen
  if (needsAuth) {
    return (
      <div className="min-h-screen bg-[#130108] flex flex-col items-center justify-center p-4 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Visual ambient circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9d1c52]/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e5b85a]/10 rounded-full blur-3xl"></div>

        {/* Language selector in upper corner */}
        <div className="absolute top-6 right-6 flex bg-[#2a0314]/50 backdrop-blur-md rounded-xl p-0.5 border border-white/10 text-xs text-rose-200/60 font-mono">
          <button
            onClick={() => setLang('fa')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              lang === 'fa' ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/25 font-bold shadow' : 'hover:text-white'
            }`}
          >
            FA
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              lang === 'en' ? 'bg-[#9d1c52] text-white border border-[#e5b85a]/25 font-bold shadow' : 'hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* Login Box */}
        <div className="bg-[#2a0314]/75 backdrop-blur-md border border-[#e5b85a]/20 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10 text-center text-white">
          <div className="mb-6 flex flex-col items-center justify-center">
            <KaraLogo size="lg" showText={true} showSubtitle={true} />
          </div>
          
          <p className="text-xs text-rose-200/50 leading-relaxed max-w-xs mx-auto mb-8 font-sans">
            {t.loginDesc}
          </p>

          {/* Show Auth errors */}
          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs mb-6 flex items-center gap-2 text-right">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          {/* Authentic Material design Sign in with Google Button */}
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-slate-800 hover:bg-[#fff9fa] hover:text-[#9d1c52] hover:border-[#9d1c52]/30 border border-transparent transition-all font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-[0.98] cursor-pointer"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            <span className="text-sm font-sans tracking-wide">{t.signInBtn}</span>
          </button>

          {/* Elegant Gold & Crimson Separator */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gradient-to-r from-transparent to-[#e5b85a]/20 flex-1"></div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#e5b85a]/70 font-mono">
              {lang === 'fa' ? 'ورود اضطراری و شبیه‌ساز' : 'EMERGENCY BYPASS / SIMULATOR'}
            </span>
            <div className="h-px bg-gradient-to-l from-transparent to-[#e5b85a]/20 flex-1"></div>
          </div>

          {/* Sandbox Access Button */}
          <button
            onClick={handleSandboxLogin}
            className="w-full bg-[#9d1c52]/15 hover:bg-[#9d1c52]/25 text-[#e5b85a] border border-[#e5b85a]/30 transition-all font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] cursor-pointer text-xs"
          >
            <Globe className="w-4 h-4 text-[#e5b85a]" />
            <span>{t.trySandbox}</span>
          </button>

          {/* Developer manual token bypass form */}
          <form onSubmit={handleManualTokenLogin} className="mt-4 flex gap-2">
            <input
              type="password"
              placeholder={t.devTokenPlaceholder}
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl focus:outline-none bg-[#2a0314]/50 border border-[#e5b85a]/15 text-white/95 placeholder:text-rose-200/25"
            />
            <button
              type="submit"
              disabled={!manualToken.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-[#9d1c52] hover:bg-[#9d1c52]/80 border border-[#e5b85a]/20 text-white rounded-xl disabled:opacity-40 transition active:scale-95 cursor-pointer flex-shrink-0"
            >
              {t.devTokenBtn}
            </button>
          </form>
        </div>

        <div className="absolute bottom-6 text-rose-300/30 text-[10px] font-mono tracking-widest text-center">
          KARA ERP V3.0.0 // ENCRYPTION AES-256 SECURED // LUXURY PREMIUM DESIGN
        </div>
      </div>
    );
  }

  // Main Authenticated Workspace Application
  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dynamic colorful mesh background */}
      <div className="mesh-bg"></div>

      {/* Main Frosted Glass Panel Wrapper */}
      <div className="glass-panel w-full max-w-7xl h-[calc(100vh-1rem)] md:h-[calc(100vh-4rem)] rounded-2xl md:rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative z-10 text-white">
        {/* Sidebar navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          user={user}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Mobile Top Header Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#1e020e]/85 border-b border-[#e5b85a]/15 backdrop-blur-md flex-shrink-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <KaraLogo size="xs" showText={false} />
            <h1 className="font-bold text-sm tracking-tight text-white font-sans">{t.appName}</h1>
          </div>

          <div className="w-8 h-8">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-full h-full rounded-full border border-[#e5b85a]/40" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#9d1c52] to-[#c22d6d] border border-[#e5b85a]/30 flex items-center justify-center text-[#e5b85a] font-bold text-[10px]">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        </div>

        {/* Primary Workspace Stage with high-performance scrolling */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white/[0.01]">
          {activeTab === 'dashboard' && (
            <Dashboard
              files={files}
              sheetData={sheetData}
              lang={lang}
              onRefresh={handleRefreshSync}
              loading={apiLoading}
              onSelectTab={(tab) => setActiveTab(tab)}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === 'drive' && (
            <DriveManager
              files={files}
              lang={lang}
              onUploadFile={handleUploadFile}
              onCreateFolder={handleCreateFolder}
              onCreateSpreadsheet={handleCreateSpreadsheet}
              onDeleteFile={handleDeleteFile}
              loading={apiLoading}
              onSelectSpreadsheet={handleSelectSpreadsheet}
            />
          )}

          {activeTab === 'sheets' && (
            <SheetsManager
              spreadsheets={spreadsheets}
              sheetData={sheetData}
              lang={lang}
              onSelectSpreadsheet={handleSelectSpreadsheet}
              onSelectTab={handleSelectTab}
              onAddTransaction={handleAddTransaction}
              onInitializeLedger={handleInitializeLedger}
              loading={apiLoading}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsComponent
              lang={lang}
              setLang={setLang}
              accessToken={token}
              user={user}
            />
          )}
        </main>
      </div>
    </div>
  );
}
