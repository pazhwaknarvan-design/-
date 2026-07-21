/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  HelpCircle, 
  Save, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign
} from 'lucide-react';
import { DriveFile, Language, SpreadsheetData } from '../types';
import { translations } from '../utils/translations';

interface SheetsManagerProps {
  spreadsheets: DriveFile[];
  sheetData: SpreadsheetData | null;
  lang: Language;
  onSelectSpreadsheet: (id: string, title: string) => Promise<void>;
  onSelectTab: (tabName: string) => Promise<void>;
  onAddTransaction: (row: any[]) => Promise<void>;
  onInitializeLedger: () => Promise<void>;
  loading: boolean;
}

export default function SheetsManager({
  spreadsheets,
  sheetData,
  lang,
  onSelectSpreadsheet,
  onSelectTab,
  onAddTransaction,
  onInitializeLedger,
  loading,
}: SheetsManagerProps) {
  const t = translations[lang];
  const isRtl = lang === 'fa';

  // Direct ID input state
  const [directId, setDirectId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Transaction Form State
  const [date, setDate] = useState(new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'));
  const [category, setCategory] = useState('sales');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [reference, setReference] = useState('');

  // Local UX states
  const [localLoading, setLocalLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Categories list
  const categories = [
    { id: 'sales', label: t.catSales },
    { id: 'salary', label: t.catSalary },
    { id: 'rent', label: t.catRent },
    { id: 'marketing', label: t.catMarketing },
    { id: 'tax', label: t.catTax },
    { id: 'purchase', label: t.catPurchase },
    { id: 'other', label: t.catOther },
  ];

  // Check if spreadsheet contains KARA ERP structure
  const isErpFormatted = useMemo(() => {
    if (!sheetData || !sheetData.headers) return false;
    const headers = sheetData.headers.map(h => h.trim());
    return (
      headers.includes('تاریخ') || 
      headers.includes('نوع') || 
      headers.includes('Date') || 
      headers.includes('Type')
    );
  }, [sheetData]);

  // Compute live sheet stats
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    if (sheetData && sheetData.headers && sheetData.rows) {
      const headers = sheetData.headers.map(h => h.trim());
      const typeIdx = headers.findIndex(h => h === 'نوع' || h.toLowerCase() === 'type');
      const amountIdx = headers.findIndex(h => h === 'مبلغ (ریال/تومان)' || h.toLowerCase().includes('amount') || h.toLowerCase().includes('mablagh'));

      sheetData.rows.forEach(row => {
        const typeVal = typeIdx !== -1 ? row[typeIdx] || '' : '';
        const amountValStr = amountIdx !== -1 ? row[amountIdx] || '0' : '0';
        const amountClean = parseFloat(amountValStr.replace(/[^\d.-]/g, '')) || 0;

        const isIncome = typeVal.includes('درآمد') || typeVal.toLowerCase().includes('income') || typeVal.toLowerCase() === 'in';
        const isExpense = typeVal.includes('هزینه') || typeVal.toLowerCase().includes('expense') || typeVal.toLowerCase() === 'out';

        if (isIncome) {
          income += amountClean;
        } else if (isExpense) {
          expense += amountClean;
        } else if (amountClean > 0) {
          income += amountClean;
        }
      });
    }

    return { income, expense, balance: income - expense };
  }, [sheetData]);

  // Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!sheetData || !sheetData.rows) return [];
    if (!searchQuery.trim()) return sheetData.rows;

    const query = searchQuery.toLowerCase();
    return sheetData.rows.filter(row => 
      row.some(cell => String(cell).toLowerCase().includes(query))
    );
  }, [sheetData, searchQuery]);

  // Handle direct ID loading
  const handleLoadDirectId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directId.trim()) return;
    setLocalLoading(true);
    setFormError(null);
    try {
      await onSelectSpreadsheet(directId.trim(), 'Manual Sheet Input');
    } catch (err: any) {
      setFormError(err.message || 'Spreadsheet not found or access denied');
    } finally {
      setLocalLoading(false);
    }
  };

  // Submit new transaction row
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!description.trim()) {
      setFormError(isRtl ? 'لطفا شرح تراکنش را وارد کنید' : 'Please enter description');
      return;
    }
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setFormError(isRtl ? 'مبلغ باید یک عدد مثبت باشد' : 'Amount must be a valid positive number');
      return;
    }

    // Launch Confirmation Guard
    setShowConfirmModal(true);
  };

  const executeAddTransaction = async () => {
    setShowConfirmModal(false);
    setLocalLoading(true);
    setFormError(null);

    try {
      const selectedCatObj = categories.find(c => c.id === category);
      const catLabel = selectedCatObj ? selectedCatObj.label : category;
      const typeLabel = type === 'income' 
        ? (isRtl ? 'درآمد' : 'Income') 
        : (isRtl ? 'هزینه' : 'Expense');

      // Colum structures: Date, Category, Description, Amount, Type, Reference
      const newRow = [
        date,
        catLabel,
        description,
        parseFloat(amount).toLocaleString(), // Formatted string
        typeLabel,
        reference || '—'
      ];

      await onAddTransaction(newRow);

      // Reset form on success
      setDescription('');
      setAmount('');
      setReference('');
      setDate(new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US'));
      
      setSuccessMsg(t.successAddRow);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save transaction row');
    } finally {
      setLocalLoading(false);
    }
  };

  const executeInitialize = async () => {
    setLocalLoading(true);
    setFormError(null);
    try {
      await onInitializeLedger();
    } catch (err: any) {
      setFormError(err.message || 'Failed to initialize ledger format');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
            {t.sheetsAnalyzer}
          </h2>
          <p className="text-sm text-white/60 mt-1 font-sans">
            {sheetData 
              ? `${lang === 'fa' ? 'مدیریت و تحلیل مالی متصل به:' : 'Analyzing financial spreadsheet:'} ${sheetData.title}`
              : lang === 'fa' ? 'صفحه گسترده مالی خود را انتخاب یا پیوند دهید' : 'Select or link an Excel/Sheets financial workbook'
            }
          </p>
        </div>
      </div>

      {/* Main Error / Success Indicators */}
      {formError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          {formError}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Spreadsheet Selectors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Drive files dropdown */}
        <div className="glass-card rounded-2xl p-5">
          <label className="block text-[11px] font-bold text-white/45 uppercase tracking-wider mb-2 font-mono">
            {t.selectSpreadsheet}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              onChange={(e) => {
                if (!e.target.value) return;
                const file = spreadsheets.find(f => f.id === e.target.value);
                if (file) onSelectSpreadsheet(file.id, file.name);
              }}
              value={sheetData?.spreadsheetId || ''}
              className="px-4 py-2.5 rounded-xl text-sm focus:outline-none bg-[#2a0314]/45 text-white/90 border border-[#e5b85a]/15 md:col-span-2 [&>option]:bg-[#2a0314] [&>option]:text-white"
            >
              <option value="">{lang === 'fa' ? '-- انتخاب شیت مالی --' : '-- Select ledger file --'}</option>
              {spreadsheets.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => sheetData && onSelectSpreadsheet(sheetData.spreadsheetId, sheetData.title)}
              disabled={!sheetData || loading || localLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#9d1c52] hover:bg-[#9d1c52]/85 border border-[#e5b85a]/30 text-white rounded-xl text-sm font-semibold shadow transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${(loading || localLoading) ? 'animate-spin' : ''}`} />
              {t.loadSheetBtn}
            </button>
          </div>
        </div>

        {/* Enter ID Direct */}
        <div className="glass-card rounded-2xl p-5">
          <label className="block text-[11px] font-bold text-white/45 uppercase tracking-wider mb-2 font-mono">
            {t.enterSpreadsheetId}
          </label>
          <form onSubmit={handleLoadDirectId} className="flex gap-2">
            <input
              type="text"
              value={directId}
              onChange={(e) => setDirectId(e.target.value)}
              placeholder="e.g. 1aBCDeFgh..."
              className="flex-1 px-4 py-2 rounded-xl text-xs font-mono focus:outline-none glass-input"
            />
            <button
              type="submit"
              disabled={!directId.trim() || localLoading}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-semibold transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {lang === 'fa' ? 'پیوند' : 'Link'}
            </button>
          </form>
        </div>
      </div>

      {/* Tabs / Sub-sheet selector if spreadsheet loaded */}
      {sheetData && (
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 p-1.5 rounded-xl self-start w-fit">
          <div className="flex items-center gap-1.5 px-3 text-xs text-white/50 font-bold border-r border-white/10">
            <Layers className="w-4 h-4" />
            <span>{t.selectTab}:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {sheetData.sheets.map((tab) => {
              const isActive = sheetData.activeSheet === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onSelectTab(tab)}
                  disabled={loading || localLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#9d1c52]/20 text-white border border-[#e5b85a]/30 shadow-md font-bold'
                      : 'text-white/60 hover:bg-[#9d1c52]/5 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Content once Sheet is loaded */}
      {sheetData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Data Ledger Table - col span 2 */}
          <div className="glass-card rounded-2xl overflow-hidden lg:col-span-2">
            {/* Table Action Controls */}
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-white/40" />
                {sheetData.title} &gt; {sheetData.activeSheet}
              </h3>
              
              {/* Search filter */}
              <div className="relative w-full md:w-64">
                <Search className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-2.5 w-4 h-4 text-white/40`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'fa' ? 'جستجو در این برگه...' : 'Search records...'}
                  className="w-full pl-9 pr-9 py-1.5 rounded-xl text-xs focus:outline-none glass-input"
                />
              </div>
            </div>

            {/* Check format */}
            {!isErpFormatted ? (
              /* If Sheet doesn't contain ERP columns, show Initialization Banner */
              <div className="p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-400 border border-white/5 mb-4">
                  <HelpCircle className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1 font-sans">{t.helpInitTitle}</h4>
                <p className="text-xs text-white/40 leading-relaxed mb-6 font-sans">
                  {t.helpInitDesc}
                </p>
                <button
                  onClick={executeInitialize}
                  disabled={loading || localLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#e5b85a] to-[#b58c3d] hover:brightness-110 text-slate-950 font-bold border border-[#e5b85a]/30 rounded-xl text-xs shadow transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {localLoading ? t.creating : t.initLedgerBtn}
                </button>
              </div>
            ) : (
              /* Elegant ERP Scrollable Grid */
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-white/[0.01] text-white/40 font-bold uppercase border-b border-white/5 sticky top-0 bg-slate-900 z-10">
                    <tr>
                      {sheetData.headers.map((h, i) => (
                        <th key={i} className="py-3 px-4 text-right font-sans">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row, rIdx) => {
                        // Guess row category type to color amount
                        const typeHeaderIdx = sheetData.headers.findIndex(h => h === 'نوع' || h.toLowerCase() === 'type');
                        const isIncome = typeHeaderIdx !== -1 && row[typeHeaderIdx] && (row[typeHeaderIdx].includes('درآمد') || row[typeHeaderIdx].toLowerCase().includes('income'));
                        
                        return (
                           <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                            {row.map((cell, cIdx) => (
                              <td 
                                key={cIdx} 
                                className={`py-3 px-4 text-white/80 text-right ${
                                  cIdx === typeHeaderIdx 
                                    ? (isIncome ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') 
                                    : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={sheetData.headers.length} className="py-8 text-center text-white/40 font-sans">
                          {t.noDataFound}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Form (only if sheet format matches ERP) */}
          <div className="space-y-6">
            {/* Sheet metrics widget */}
            <div className="glass-card rounded-2xl p-5 text-white">
              <h4 className="text-[11px] font-bold text-white/45 uppercase tracking-wider font-mono mb-4">
                {lang === 'fa' ? 'آمار کل برگه جاری' : 'Active Tab KPI Summary'}
              </h4>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-white/70 font-semibold">{t.income}</span>
                  </div>
                  <span className="text-sm font-bold font-sans text-emerald-400">{stats.income.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-400">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-white/70 font-semibold">{t.expense}</span>
                  </div>
                  <span className="text-sm font-bold font-sans text-rose-400">{stats.expense.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#e5b85a]/5 border border-[#e5b85a]/15 rounded-xl pt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#e5b85a]/10 rounded-lg flex items-center justify-center text-[#e5b85a]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-white/70 font-semibold">{lang === 'fa' ? 'تراز مالی برگه' : 'Net Sheet Balance'}</span>
                  </div>
                  <span className="text-sm font-bold font-sans text-[#e5b85a]">{stats.balance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Form Section */}
            {isErpFormatted && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#e5b85a]" />
                  {t.addTransaction}
                </h3>
                
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
                  {/* Type Income / Expense */}
                  <div>
                    <span className="block text-white/45 mb-1.5">{t.transactionType}</span>
                    <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 rounded-lg transition text-center cursor-pointer ${
                          type === 'income'
                            ? 'bg-emerald-500 text-white font-bold shadow-sm'
                            : 'text-white/50 hover:bg-white/5'
                        }`}
                      >
                        {t.income}
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 rounded-lg transition text-center cursor-pointer ${
                          type === 'expense'
                            ? 'bg-rose-500 text-white font-bold shadow-sm'
                            : 'text-white/50 hover:bg-white/5'
                        }`}
                      >
                        {t.expense}
                      </button>
                    </div>
                  </div>

                  {/* Transaction Date */}
                  <div>
                    <label className="block text-white/45 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      {t.transactionDate}
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none glass-input font-sans"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-white/45 mb-1">{t.category}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none bg-[#2a0314]/45 text-white/90 border border-[#e5b85a]/15 [&>option]:bg-[#2a0314] [&>option]:text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/45 mb-1">{t.description}</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={lang === 'fa' ? 'شرح بابت فروش، خرید یا تجهیز...' : 'e.g., Software sub renewal'}
                      className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none glass-input"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-white/45 mb-1">{t.amount}</label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 15000000"
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono focus:outline-none glass-input"
                    />
                  </div>

                  {/* Reference */}
                  <div>
                    <label className="block text-white/45 mb-1">{t.reference}</label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="REF-0102"
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono focus:outline-none glass-input"
                    />
                  </div>

                  {/* Submit row Button */}
                  <button
                    type="submit"
                    disabled={loading || localLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#9d1c52] hover:bg-[#9d1c52]/85 border border-[#e5b85a]/30 text-white rounded-xl font-bold shadow transition active:scale-95 disabled:opacity-50 text-xs cursor-pointer"
                  >
                    {localLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {t.saveTransactionBtn}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 mx-auto mb-4 border border-white/5">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-2 font-sans">
            {lang === 'fa' ? 'هیچ لجر مالی بارگذاری نشده است' : 'No general ledger linked'}
          </h3>
          <p className="text-xs text-white/45 leading-relaxed mb-6 font-sans">
            {lang === 'fa' 
              ? 'جهت تحلیل تراکنشهای حسابداری و درج اقلام مالی جدید، لطفا یکی از دفاتر کل مالی خود را در منوی بالا انتخاب کنید یا شناسه شیت را به صورت دستی پیوند دهید.'
              : 'Please select a spreadsheet workbook from the Google Drive dropdown or provide its direct document ID to enable ledger tables and accounting entries.'
            }
          </p>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#e5b85a]/20 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="w-12 h-12 bg-[#9d1c52]/15 rounded-xl flex items-center justify-center text-[#e5b85a] mb-4 mx-auto border border-[#e5b85a]/20">
              <CheckCircle className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-1 font-sans">
              {lang === 'fa' ? 'تایید ثبت تراکنش مالی' : 'Confirm Ledger Transaction'}
            </h3>
            <p className="text-xs text-white/40 text-center mb-5 px-2 font-sans">
              {lang === 'fa' 
                ? 'آیا از ثبت نهایی این سطر تراکنش مالی در فایل دفتر کل گوگل شیت اطمینان دارید؟' 
                : 'Are you sure you want to finalize and write this bookkeeping entry row directly into your Google Sheets file?'
              }
            </p>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6 space-y-2.5 text-xs text-white/80 font-semibold">
              <div className="flex justify-between">
                <span className="text-white/40">{t.transactionType}:</span>
                <span className={`font-bold ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {type === 'income' ? t.income : t.expense}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">{t.description}:</span>
                <span className="truncate max-w-[180px]">{description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">{t.amount}:</span>
                <span className="font-mono text-white">{parseFloat(amount).toLocaleString()}</span>
              </div>
              {reference && (
                <div className="flex justify-between">
                  <span className="text-white/40">{t.reference}:</span>
                  <span className="font-mono text-white">{reference}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 text-white/60 hover:bg-white/5 rounded-xl border border-white/10 flex-1 transition cursor-pointer"
              >
                {lang === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={executeAddTransaction}
                disabled={localLoading}
                className="px-4 py-2.5 bg-[#9d1c52] hover:bg-[#9d1c52]/85 border border-[#e5b85a]/30 text-white rounded-xl shadow flex-1 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {localLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-4 h-4" />}
                {lang === 'fa' ? 'تایید و ثبت' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
