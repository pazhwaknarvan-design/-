/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
  owners?: Array<{
    displayName: string;
    photoLink?: string;
  }>;
}

export interface SpreadsheetData {
  spreadsheetId: string;
  title: string;
  sheets: string[];
  activeSheet: string;
  headers: string[];
  rows: string[][];
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  reference?: string;
}

export type ActiveTab = 'dashboard' | 'drive' | 'sheets' | 'settings';
export type Language = 'fa' | 'en';
