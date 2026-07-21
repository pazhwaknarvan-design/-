/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpreadsheetData } from '../types';
import {
  mockGetSpreadsheetMetadata,
  mockGetSheetValues,
  mockAppendSheetRow,
  mockInitializeErpLedger
} from './mockStorage';

/**
 * Fetches sheet metadata (title and sheet names/tabs).
 */
export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheets: string[] }> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockGetSpreadsheetMetadata(spreadsheetId);
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet metadata');
  }

  const data = await response.json();
  const title = data.properties?.title || 'Untitled Spreadsheet';
  const sheets = (data.sheets || []).map((s: any) => s.properties?.title || 'Sheet1');

  return { title, sheets };
}

/**
 * Reads values from a specific sheet / tab range.
 * Defaults to reading the whole sheet (e.g., 'Sheet1!A1:Z1000').
 */
export async function getSheetValues(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  range = 'A1:Z1000'
): Promise<{ headers: string[]; rows: string[][] }> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockGetSheetValues(spreadsheetId, sheetName);
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!${range}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch spreadsheet values');
  }

  const data = await response.json();
  const values: string[][] = data.values || [];

  if (values.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = values[0];
  const rows = values.slice(1);

  return { headers, rows };
}

/**
 * Appends a row of values to a specific sheet.
 */
export async function appendSheetRow(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  rowValues: any[]
): Promise<void> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockAppendSheetRow(spreadsheetId, sheetName, rowValues);
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!A:A`,
      majorDimension: 'ROWS',
      values: [rowValues],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to append row to spreadsheet');
  }
}

/**
 * Initializes a new spreadsheet with default ERP General Ledger headers.
 * Columns: Date, Category, Description, Amount, Type (Income/Expense), Reference/Invoice
 */
export async function initializeErpLedger(
  accessToken: string,
  spreadsheetId: string,
  sheetName = 'Sheet1'
): Promise<void> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockInitializeErpLedger(spreadsheetId, sheetName);
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:F1?valueInputOption=USER_ENTERED`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `${sheetName}!A1:F1`,
      majorDimension: 'ROWS',
      values: [['تاریخ', 'دسته بندی', 'توضیحات', 'مبلغ (ریال/تومان)', 'نوع', 'شماره مرجع / فاکتور']],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to initialize ERP headers in spreadsheet');
  }

  // Add a sample transaction row so they see how it looks
  const today = new Date().toLocaleDateString('fa-IR');
  await appendSheetRow(accessToken, spreadsheetId, sheetName, [
    today,
    'تاسیس / موجودی اولیه',
    'موجودی اولیه راه اندازی سیستم کارا ERP',
    '10000000',
    'درآمد',
    'REF-0001'
  ]);
}
