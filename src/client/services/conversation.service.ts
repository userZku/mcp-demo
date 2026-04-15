import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utilise le home directory pour la DB (plus portable)
const dataDir = path.resolve(os.homedir(), '.mcp-demo');
const dbPath = path.resolve(dataDir, 'conversations.db');

interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

class ClientConversationService {
  private db: Database.Database | null = null;

  private ensureDataDir(): void {
    const fs = require('fs');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private getDb(): Database.Database {
    if (!this.db) {
      this.ensureDataDir();
      this.db = new Database(dbPath);
      this.db.pragma('journal_mode = WAL');
      this.initializeSchema();
    }
    return this.db;
  }

  private initializeSchema(): void {
    const db = this.db!;
    db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        messages TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
    `);
  }

  loadConversation(conversationId?: string): Conversation | null {
    const db = this.getDb();
    
    let stmt;
    if (conversationId) {
      stmt = db.prepare('SELECT * FROM conversations WHERE id = ?');
      const row = stmt.get(conversationId) as any;
      if (!row) return null;
      return this.parseConversationRow(row);
    } else {
      // Load most recent conversation
      stmt = db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 1');
      const row = stmt.get() as any;
      if (!row) return null;
      return this.parseConversationRow(row);
    }
  }

  saveConversation(conversationId: string, messages: ChatMessage[]): Conversation {
    const db = this.getDb();
    const now = Date.now();
    const messagesJson = JSON.stringify(messages);

    const stmt = db.prepare(`
      INSERT INTO conversations (id, messages, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET messages = ?, updated_at = ?
    `);

    stmt.run(conversationId, messagesJson, now, now, messagesJson, now);

    return {
      id: conversationId,
      messages,
      createdAt: now,
      updatedAt: now,
    };
  }

  appendMessages(conversationId: string, newMessages: ChatMessage[]): Conversation {
    const existing = this.loadConversation(conversationId);
    const allMessages = existing ? [...existing.messages, ...newMessages] : newMessages;
    return this.saveConversation(conversationId, allMessages);
  }

  listConversations(limit: number = 10): Array<{
    id: string;
    messageCount: number;
    createdAt: number;
    updatedAt: number;
  }> {
    const db = this.getDb();
    const stmt = db.prepare(`
      SELECT id, messages, created_at, updated_at
      FROM conversations
      ORDER BY updated_at DESC
      LIMIT ?
    `);

    const rows = stmt.all(limit) as any[];
    return rows.map((row) => ({
      id: row.id,
      messageCount: JSON.parse(row.messages).length,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  deleteConversation(conversationId: string): boolean {
    const db = this.getDb();
    const stmt = db.prepare('DELETE FROM conversations WHERE id = ?');
    const result = stmt.run(conversationId);
    return result.changes > 0;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  private parseConversationRow(row: any): Conversation {
    return {
      id: row.id,
      messages: JSON.parse(row.messages),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const clientConversationService = new ClientConversationService();
