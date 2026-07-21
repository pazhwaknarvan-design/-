/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveFile } from '../types';

const DRIVE_FILES_KEY = 'kara_demo_drive_files';
const SHEET_META_PREFIX = 'kara_demo_sheet_meta_';
const SHEET_VALUES_PREFIX = 'kara_demo_sheet_values_';

// Initialize default mock data in localStorage if empty
export function initMockStorage() {
  if (!localStorage.getItem(DRIVE_FILES_KEY)) {
    const defaultFiles: DriveFile[] = [
      {
        id: 'demo-sheet-1',
        name: 'دفتر کل مالی کارا ۱۴۰۵ (Kara Ledger 1405)',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        modifiedTime: new Date().toISOString(),
        size: '15 KB',
        webViewLink: 'https://docs.google.com/spreadsheets/d/demo-sheet-1/edit',
        iconLink: 'https://fonts.gstatic.com/s/i/productlogos/sheets_2020q4/v1/web-16.png',
        owners: [{ displayName: 'پشتیبانی کارا (Kara Support)' }]
      },
      {
        id: 'demo-folder-1',
        name: 'اسناد مالی ۱۴۰۵ (Financial Documents)',
        mimeType: 'application/vnd.google-apps.folder',
        modifiedTime: new Date(Date.now() - 3600000 * 2).toISOString(),
        iconLink: 'https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v1/web-16.png',
        owners: [{ displayName: 'پشتیبانی کارا (Kara Support)' }]
      },
      {
        id: 'demo-pdf-1',
        name: 'فاکتور_خرید_تجهیزات_سرور.pdf',
        mimeType: 'application/pdf',
        modifiedTime: new Date(Date.now() - 3600000 * 24).toISOString(),
        size: '1.2 MB',
        webViewLink: '#',
        owners: [{ displayName: 'پشتیبانی کارا (Kara Support)' }]
      },
      {
        id: 'demo-img-1',
        name: 'رسید_پرداخت_بانکی.png',
        mimeType: 'image/png',
        modifiedTime: new Date(Date.now() - 3600000 * 48).toISOString(),
        size: '420 KB',
        webViewLink: '#',
        owners: [{ displayName: 'پشتیبانی کارا (Kara Support)' }]
      }
    ];
    localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(defaultFiles));

    // Save metadata for the main sheet
    localStorage.setItem(
      `${SHEET_META_PREFIX}demo-sheet-1`,
      JSON.stringify({
        title: 'دفتر کل مالی کارا ۱۴۰۵ (Kara Ledger 1405)',
        sheets: ['برگه اصلی (Main Sheet)', 'تراکنش‌های فصلی']
      })
    );

    // Save values for "برگه اصلی (Main Sheet)"
    localStorage.setItem(
      `${SHEET_VALUES_PREFIX}demo-sheet-1_برگه اصلی (Main Sheet)`,
      JSON.stringify({
        headers: ['تاریخ', 'دسته بندی', 'توضیحات', 'مبلغ (ریال/تومان)', 'نوع', 'شماره مرجع / فاکتور'],
        rows: [
          [new Date().toLocaleDateString('fa-IR'), 'فروش محصول', 'فروش لایسنس نرم‌افزار کارا به شرکت آریا', '450000000', 'درآمد', 'TXN-8801'],
          [new Date(Date.now() - 86400000).toLocaleDateString('fa-IR'), 'اجاره دفتر', 'پرداخت اجاره بهای دفتر مرکزی تهران', '120000000', 'هزینه', 'TXN-8802'],
          [new Date(Date.now() - 86400000 * 2).toLocaleDateString('fa-IR'), 'حقوق پرسنل', 'پرداخت حقوق و دستمزد تیم فنی', '280000000', 'هزینه', 'TXN-8803'],
          [new Date(Date.now() - 86400000 * 3).toLocaleDateString('fa-IR'), 'خدمات پشتیبانی', 'دریافت هزینه پشتیبانی ماهانه پارس لند', '85000000', 'درآمد', 'TXN-8804'],
          [new Date(Date.now() - 86400000 * 4).toLocaleDateString('fa-IR'), 'خرید تجهیزات', 'خرید سرور اختصاصی ابری جدید', '190000000', 'هزینه', 'TXN-8805']
        ]
      })
    );

    // Save values for "تراکنش‌های فصلی"
    localStorage.setItem(
      `${SHEET_VALUES_PREFIX}demo-sheet-1_تراکنش‌های فصلی`,
      JSON.stringify({
        headers: ['تاریخ', 'دسته بندی', 'توضیحات', 'مبلغ (ریال/تومان)', 'نوع', 'شماره مرجع / فاکتور'],
        rows: [
          [new Date(Date.now() - 86400000 * 30).toLocaleDateString('fa-IR'), 'موجودی اولیه', 'انتقال مانده حساب سال مالی گذشته', '1500000000', 'درآمد', 'INIT-001']
        ]
      })
    );
  }
}

// Drive Operations
export function mockListDriveFiles(): DriveFile[] {
  initMockStorage();
  const data = localStorage.getItem(DRIVE_FILES_KEY);
  return data ? JSON.parse(data) : [];
}

export function mockCreateDriveFolder(name: string): DriveFile {
  initMockStorage();
  const files = mockListDriveFiles();
  const newFolder: DriveFile = {
    id: `demo-folder-${Date.now()}`,
    name,
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: new Date().toISOString(),
    iconLink: 'https://fonts.gstatic.com/s/i/productlogos/drive_2020q4/v1/web-16.png',
    owners: [{ displayName: 'کاربر دمو (Demo User)' }]
  };
  files.unshift(newFolder);
  localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(files));
  return newFolder;
}

export function mockCreateSpreadsheet(title: string): DriveFile {
  initMockStorage();
  const files = mockListDriveFiles();
  const newSheet: DriveFile = {
    id: `demo-sheet-${Date.now()}`,
    name: title,
    mimeType: 'application/vnd.google-apps.spreadsheet',
    modifiedTime: new Date().toISOString(),
    size: '1 KB',
    webViewLink: '#',
    iconLink: 'https://fonts.gstatic.com/s/i/productlogos/sheets_2020q4/v1/web-16.png',
    owners: [{ displayName: 'کاربر دمو (Demo User)' }]
  };
  files.unshift(newSheet);
  localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(files));

  // Initialize spreadsheet metadata
  localStorage.setItem(
    `${SHEET_META_PREFIX}${newSheet.id}`,
    JSON.stringify({
      title,
      sheets: ['Sheet1']
    })
  );

  // Initialize sheet values empty
  localStorage.setItem(
    `${SHEET_VALUES_PREFIX}${newSheet.id}_Sheet1`,
    JSON.stringify({
      headers: [],
      rows: []
    })
  );

  return newSheet;
}

export function mockUploadFileToDrive(file: File): DriveFile {
  initMockStorage();
  const files = mockListDriveFiles();
  const sizeString = file.size > 1024 * 1024 
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
    : `${(file.size / 1024).toFixed(0)} KB`;

  const newFile: DriveFile = {
    id: `demo-file-${Date.now()}`,
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    modifiedTime: new Date().toISOString(),
    size: sizeString,
    webViewLink: '#',
    owners: [{ displayName: 'کاربر دمو (Demo User)' }]
  };
  files.unshift(newFile);
  localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(files));
  return newFile;
}

export function mockDeleteDriveFile(fileId: string): void {
  initMockStorage();
  let files = mockListDriveFiles();
  files = files.filter(f => f.id !== fileId);
  localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(files));
}

// Sheets Operations
export function mockGetSpreadsheetMetadata(spreadsheetId: string): { title: string; sheets: string[] } {
  initMockStorage();
  const data = localStorage.getItem(`${SHEET_META_PREFIX}${spreadsheetId}`);
  if (data) {
    return JSON.parse(data);
  }
  return {
    title: 'دفتر کل دمو (Demo Ledger)',
    sheets: ['Sheet1']
  };
}

export function mockGetSheetValues(spreadsheetId: string, sheetName: string): { headers: string[]; rows: string[][] } {
  initMockStorage();
  const key = `${SHEET_VALUES_PREFIX}${spreadsheetId}_${sheetName}`;
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return { headers: [], rows: [] };
}

export function mockAppendSheetRow(spreadsheetId: string, sheetName: string, rowValues: any[]): void {
  initMockStorage();
  const key = `${SHEET_VALUES_PREFIX}${spreadsheetId}_${sheetName}`;
  let data = { headers: [] as string[], rows: [] as string[][] };
  const existing = localStorage.getItem(key);
  if (existing) {
    data = JSON.parse(existing);
  }
  data.rows.unshift(rowValues); // Insert new transaction at top
  localStorage.setItem(key, JSON.stringify(data));

  // Update Drive File modified time
  let files = mockListDriveFiles();
  const fileIndex = files.findIndex(f => f.id === spreadsheetId);
  if (fileIndex !== -1) {
    files[fileIndex].modifiedTime = new Date().toISOString();
    // Update size dynamically as we add transactions
    const count = data.rows.length;
    files[fileIndex].size = `${(1 + count * 0.2).toFixed(1)} KB`;
    localStorage.setItem(DRIVE_FILES_KEY, JSON.stringify(files));
  }
}

export function mockInitializeErpLedger(spreadsheetId: string, sheetName = 'Sheet1'): void {
  initMockStorage();
  const key = `${SHEET_VALUES_PREFIX}${spreadsheetId}_${sheetName}`;
  const data = {
    headers: ['تاریخ', 'دسته بندی', 'توضیحات', 'مبلغ (ریال/تومان)', 'نوع', 'شماره مرجع / فاکتور'],
    rows: [
      [new Date().toLocaleDateString('fa-IR'), 'تاسیس / موجودی اولیه', 'موجودی اولیه راه اندازی سیستم کارا ERP', '10000000', 'درآمد', 'REF-0001']
    ]
  };
  localStorage.setItem(key, JSON.stringify(data));

  // Ensure metadata lists the sheet
  const meta = mockGetSpreadsheetMetadata(spreadsheetId);
  if (!meta.sheets.includes(sheetName)) {
    meta.sheets.push(sheetName);
    localStorage.setItem(`${SHEET_META_PREFIX}${spreadsheetId}`, JSON.stringify(meta));
  }
}
