/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Folder, 
  FileSpreadsheet, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Plus, 
  File, 
  FileText, 
  Image, 
  Loader2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { DriveFile, Language } from '../types';
import { translations } from '../utils/translations';

interface DriveManagerProps {
  files: DriveFile[];
  lang: Language;
  onUploadFile: (file: File) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  onCreateSpreadsheet: (title: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  loading: boolean;
  onSelectSpreadsheet: (id: string, title: string) => void;
}

export default function DriveManager({
  files,
  lang,
  onUploadFile,
  onCreateFolder,
  onCreateSpreadsheet,
  onDeleteFile,
  loading,
  onSelectSpreadsheet,
}: DriveManagerProps) {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [sheetTitle, setSheetTitle] = useState('');

  const [dragActive, setDragActive] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Deletion Confirmation Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setActionError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setLocalLoading(true);
      try {
        await onUploadFile(e.dataTransfer.files[0]);
      } catch (err: any) {
        setActionError(err.message || 'Failed to upload file');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionError(null);
    if (e.target.files && e.target.files[0]) {
      setLocalLoading(true);
      try {
        await onUploadFile(e.target.files[0]);
      } catch (err: any) {
        setActionError(err.message || 'Failed to upload file');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    setLocalLoading(true);
    setActionError(null);
    try {
      await onCreateFolder(folderName);
      setFolderName('');
      setShowFolderModal(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create folder');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCreateSheetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sheetTitle.trim()) return;
    setLocalLoading(true);
    setActionError(null);
    try {
      await onCreateSpreadsheet(sheetTitle);
      setSheetTitle('');
      setShowSheetModal(false);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create spreadsheet');
    } finally {
      setLocalLoading(false);
    }
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    setLocalLoading(true);
    setActionError(null);
    try {
      await onDeleteFile(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteName(null);
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete file');
    } finally {
      setLocalLoading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
    }
    if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (mimeType.includes('image')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr);
    if (isNaN(bytes)) return '—';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
            {t.driveManager}
          </h2>
          <p className="text-sm text-white/60 mt-1 max-w-2xl">
            {t.driveScopeInfo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <Folder className="w-4 h-4 text-amber-400" />
            {t.createNewFolder}
          </button>
          <button
            onClick={() => setShowSheetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            {t.createNewSheet}
          </button>
        </div>
      </div>

      {/* Action / Error Banner */}
      {actionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          {actionError}
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
          dragActive
            ? 'border-[#e5b85a] bg-[#9d1c52]/10'
            : 'border-[#e5b85a]/20 bg-[#9d1c52]/3 hover:border-[#e5b85a]/40 hover:bg-[#9d1c52]/6'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-12 h-12 bg-[#9d1c52]/10 rounded-xl flex items-center justify-center text-[#e5b85a] mb-3 border border-[#e5b85a]/20">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white/95">
          {t.dragDropInfo}
        </p>
        <p className="text-xs text-white/45 mt-1 font-sans">
          {lang === 'fa' ? 'اسناد قرارداد، فاکتورها، و صورتحسابها' : 'Contracts, invoices, sheets, and audit PDFs'}
        </p>
      </div>

      {/* File List Grid/Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">
            {lang === 'fa' ? 'فایلهای متصل در گوگل درایو' : 'Authorized drive files'}
          </h3>
          {(loading || localLoading) && (
            <div className="flex items-center gap-1.5 text-xs text-[#e5b85a] font-semibold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.creating}</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {files.length > 0 ? (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.01] text-white/40 text-[10px] font-bold uppercase tracking-wider border-b border-white/5">
                  <th className="py-3 px-5 text-right font-sans">{t.fileName}</th>
                  <th className="py-3 px-5 text-right font-sans">{t.fileSize}</th>
                  <th className="py-3 px-5 text-right font-sans">{t.modifiedTime}</th>
                  <th className="py-3 px-5 text-center font-sans">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {files.map((file) => (
                  <tr 
                    key={file.id} 
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-white/90">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.mimeType)}
                        <span className="truncate max-w-[240px] text-xs font-medium" title={file.name}>
                          {file.name}
                        </span>
                        {file.mimeType === 'application/vnd.google-apps.spreadsheet' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSpreadsheet(file.id, file.name);
                            }}
                            className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-md text-[9px] font-bold font-sans transition cursor-pointer"
                          >
                            {lang === 'fa' ? 'تحلیل مالی' : 'Analyze'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-white/50 font-mono text-[11px] text-right">
                      {formatBytes(file.size)}
                    </td>
                    <td className="py-3.5 px-5 text-white/50 font-sans text-xs text-right">
                      {file.modifiedTime 
                        ? new Date(file.modifiedTime).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) 
                        : '—'
                      }
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-white/40 hover:text-[#e5b85a] bg-white/5 hover:bg-white/10 rounded-lg transition"
                            title={t.openFile}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setConfirmDeleteId(file.id);
                            setConfirmDeleteName(file.name);
                          }}
                          className="p-1.5 text-white/40 hover:text-rose-400 bg-white/5 hover:bg-white/10 rounded-lg transition cursor-pointer"
                          title={t.deleteFile}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <FolderOpen className="w-12 h-12 text-white/10 mb-2" />
              <p className="text-xs">{t.noActivity}</p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 text-white">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 font-sans">
              <Folder className="w-5 h-5 text-amber-400 fill-amber-400/10" />
              {t.createNewFolder}
            </h3>
            <p className="text-xs text-white/40 mb-4">
              {lang === 'fa' ? 'ایجاد یک پوشه سازمان یافته در فضای ابری گوگل' : 'Create a structured directory on Google Cloud'}
            </p>
            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder={t.folderNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none glass-input"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setShowFolderModal(false);
                    setFolderName('');
                  }}
                  className="px-4 py-2 text-white/60 hover:bg-white/5 rounded-lg transition cursor-pointer"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim() || localLoading}
                  className="px-4 py-2 bg-[#9d1c52] hover:bg-[#9d1c52]/80 border border-[#e5b85a]/30 text-white rounded-lg shadow disabled:opacity-50 transition cursor-pointer"
                >
                  {localLoading ? t.creating : (lang === 'fa' ? 'ایجاد پوشه' : 'Create Folder')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SHEET MODAL */}
      {showSheetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 text-white">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2 font-sans">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              {t.createNewSheet}
            </h3>
            <p className="text-xs text-white/40 mb-4">
              {lang === 'fa' ? 'ایجاد دفتر کل مالی در قالب فایل صفحه گسترده گوگل' : 'Create a financial general ledger on Google Sheets'}
            </p>
            <form onSubmit={handleCreateSheetSubmit} className="space-y-4">
              <input
                type="text"
                value={sheetTitle}
                onChange={(e) => setSheetTitle(e.target.value)}
                placeholder={t.sheetNamePlaceholder}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none glass-input"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setShowSheetModal(false);
                    setSheetTitle('');
                  }}
                  className="px-4 py-2 text-white/60 hover:bg-white/5 rounded-lg transition cursor-pointer"
                >
                  {lang === 'fa' ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!sheetTitle.trim() || localLoading}
                  className="px-4 py-2 bg-[#9d1c52] hover:bg-[#9d1c52]/80 border border-[#e5b85a]/30 text-white rounded-lg shadow disabled:opacity-50 transition cursor-pointer"
                >
                  {localLoading ? t.creating : (lang === 'fa' ? 'ایجاد لجر' : 'Create Ledger')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-md shadow-2xl border border-rose-500/30 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 mb-4 mx-auto border border-rose-500/20">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-1 font-sans">
              {t.deleteFile}
            </h3>
            <p className="text-xs text-white/40 text-center mb-4 leading-relaxed px-2 font-sans">
              {t.confirmDeleteFile}
            </p>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl mb-6 text-xs text-center font-semibold text-white/80 truncate">
              {confirmDeleteName}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteName(null);
                }}
                className="px-4 py-2.5 text-white/60 hover:bg-white/5 rounded-xl border border-white/10 flex-1 transition cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={localLoading}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow flex-1 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {localLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {t.deleteFile}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
