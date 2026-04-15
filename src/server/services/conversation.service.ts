import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../.data/conversations.db');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema(): void {
  const database = db!;
  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      messages TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
  `);
}

export const conversationService = {
  /**
   * Load conversation history by ID (or latest if no ID provided)
   */
  loadConversation(conversationId?: string): Conversation | null {
    const database = getDb();
    
    let stmt;
    if (conversationId) {
      stmt = database.prepare('SELECT * FROM conversations WHERE id = ?');
      const row = stmt.get(conversationId) as any;
      if (!row) return null;
      return parseConversationRow(row);
    } else {
      // Load most recent conversation
      stmt = database.prepare('SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 1');
      const row = stmt.get() as any;
      if (!row) return null;
      return parseConversationRow(row);
    }
  },

  /**
   * Save or update conversation history
   */
  saveConversation(conversationId: string, messages: ChatMessage[]): Conversation {
    const database = getDb();
    const now = Date.now();
    const messagesJson = JSON.stringify(messages);

    const stmt = database.prepare(`
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
  },

  /**
   * Append messages to existing conversation
   */
  appendMessages(conversationId: string, newMessages: ChatMessage[]): Conversation {
    const existing = this.loadConversation(conversationId);
    const allMessages = existing ? [...existing.messages, ...newMessages] : newMessages;
    return this.saveConversation(conversationId, allMessages);
  },

  /**
   * List all conversations (metadata only, not full message history)
   */
  listConversations(limit: number = 10): Array<{
    id: string;
    messageCount: number;
    createdAt: number;
    updatedAt: number;
  }> {
    const database = getDb();
    const stmt = database.prepare(`
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
  },

  /**
   * Delete conversation
   */
  deleteConversation(conversationId: string): boolean {
    const database = getDb();
    const stmt = database.prepare('DELETE FROM conversations WHERE id = ?');
    const result = stmt.run(conversationId);
    return result.changes > 0;
  },

  /**
   * Close database connection
   */
  close(): void {
    if (db) {
      db.close();
      db = null;
    }
  },
};

function parseConversationRow(row: any): Conversation {
  return {
    id: row.id,
    messages: JSON.parse(row.messages),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
