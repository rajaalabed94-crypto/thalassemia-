import fs from 'fs';
import path from 'path';
import type { AdminSupportRecord, ChatCallbackRecord } from '../shared/campaignEngine.ts';

interface StoreData {
  records: AdminSupportRecord[];
  chatCallbacks: ChatCallbackRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'support-requests.json');

export function readStore(): StoreData {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      return { records: [], chatCallbacks: [] };
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      records: Array.isArray(parsed.records) ? parsed.records : [],
      chatCallbacks: Array.isArray(parsed.chatCallbacks) ? parsed.chatCallbacks : []
    };
  } catch (error) {
    console.error('Failed to read support requests store:', error);
    return { records: [], chatCallbacks: [] };
  }
}

export function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${STORE_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, STORE_FILE);
}
