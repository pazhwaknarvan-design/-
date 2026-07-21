/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DriveFile } from '../types';
import { 
  mockListDriveFiles, 
  mockCreateDriveFolder, 
  mockCreateSpreadsheet, 
  mockUploadFileToDrive, 
  mockDeleteDriveFile 
} from './mockStorage';

/**
 * Lists files created or opened by this app in Google Drive.
 */
export async function listDriveFiles(accessToken: string): Promise<DriveFile[]> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockListDriveFiles();
  }

  const url = 'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,modifiedTime,size,iconLink,webViewLink,owners)&orderBy=modifiedTime desc';

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to list Google Drive files');
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Creates a new folder in Google Drive.
 */
export async function createDriveFolder(
  accessToken: string,
  name: string,
  parentFolderId?: string
): Promise<DriveFile> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockCreateDriveFolder(name);
  }

  const url = 'https://www.googleapis.com/drive/v3/files';
  const body = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create folder');
  }

  return response.json();
}

/**
 * Creates a new Google Spreadsheet inside Google Drive (optionally in a folder).
 */
export async function createSpreadsheet(
  accessToken: string,
  title: string,
  parentFolderId?: string
): Promise<DriveFile> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockCreateSpreadsheet(title);
  }

  const url = 'https://www.googleapis.com/drive/v3/files';
  const body = {
    name: title,
    mimeType: 'application/vnd.google-apps.spreadsheet',
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create spreadsheet file');
  }

  return response.json();
}

/**
 * Uploads a file to Google Drive.
 * Uses a metadata-then-media two-step process for absolute robustness and simplicity in the browser.
 */
export async function uploadFileToDrive(
  accessToken: string,
  file: File,
  parentFolderId?: string
): Promise<DriveFile> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockUploadFileToDrive(file);
  }

  // Step 1: Create file metadata
  const metaUrl = 'https://www.googleapis.com/drive/v3/files';
  const metaBody = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const metaResponse = await fetch(metaUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metaBody),
  });

  if (!metaResponse.ok) {
    const errorData = await metaResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to create file metadata in Drive');
  }

  const fileMetadata = await metaResponse.json();
  const fileId = fileMetadata.id;

  // Step 2: Upload media content
  const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json().catch(() => ({}));
    // Clean up metadata if media upload fails
    await deleteDriveFileSilently(accessToken, fileId);
    throw new Error(errorData.error?.message || 'Failed to upload file content to Drive');
  }

  return uploadResponse.json();
}

/**
 * Deletes a file from Google Drive.
 * UI confirmation MUST guard this call.
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  if (accessToken === 'DEMO_TOKEN') {
    return mockDeleteDriveFile(fileId);
  }

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to delete file from Google Drive');
  }
}

/**
 * Internal silent deletion helper for rollbacks.
 */
async function deleteDriveFileSilently(accessToken: string, fileId: string): Promise<void> {
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.warn('Failed to clean up file metadata after upload failed:', e);
  }
}
