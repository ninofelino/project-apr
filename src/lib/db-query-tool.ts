import { db } from '../db';
import { sql } from 'drizzle-orm';
import * as schema from '../drizzle/schema';

export interface QueryIntent {
  action: 'tables' | 'fetch' | 'schema' | 'count' | 'rtdb' | 'unknown';
  table?: string;
  path?: string;
  id?: string;
  limit?: number;
  offset?: number;
}

export function parseQueryIntent(message: string): QueryIntent {
  const msg = message.toLowerCase();

  // Detect RTDB intent
  if (msg.includes('rtdb') || msg.includes('firebase') || msg.includes('realtime')) {
    const pathMatch = msg.match(/(?:path|jalur)\s+([a-zA-Z0-9_\/]+)/);
    return { 
      action: 'rtdb', 
      path: pathMatch ? pathMatch[1] : undefined 
    };
  }

  // Basic intent detection
  if (msg.includes('list all tables') || msg.includes('show tables') || msg.includes('apa saja tabelnya')) {
    return { action: 'tables' };
  }

  // Detect table names from schema
  const tableNames = Object.keys(schema).filter(k => !k.endsWith('Relations') && !k.endsWith('Enum'));
  const foundTable = tableNames.find(t => msg.includes(t.toLowerCase()));

  if (foundTable) {
    if (msg.includes('how many') || msg.includes('berapa jumlah') || msg.includes('count')) {
      return { action: 'count', table: foundTable };
    }
    if (msg.includes('schema') || msg.includes('structure') || msg.includes('struktur')) {
      return { action: 'schema', table: foundTable };
    }
    
    // Default to fetch if table name is mentioned
    const idMatch = msg.match(/id\s*=?\s*(\d+)/);
    const limitMatch = msg.match(/limit\s*(\d+)/);
    const offsetMatch = msg.match(/offset\s*(\d+)/);

    return {
      action: 'fetch',
      table: foundTable,
      id: idMatch ? idMatch[1] : undefined,
      limit: limitMatch ? parseInt(limitMatch[1]) : 10,
      offset: offsetMatch ? parseInt(offsetMatch[1]) : 0
    };
  }

  return { action: 'unknown' };
}

export async function executeQuery(intent: QueryIntent) {
  try {
    switch (intent.action) {
      case 'tables':
        const tables = Object.keys(schema).filter(k => !k.endsWith('Relations') && !k.endsWith('Enum'));
        return { success: true, data: tables };
      
      case 'count':
        if (!intent.table) throw new Error('Table name required');
        const countResult = await db.execute(sql`SELECT count(*) FROM ${sql.identifier(intent.table)}`);
        return { success: true, data: countResult[0] };

      case 'schema':
        if (!intent.table) throw new Error('Table name required');
        // This is a simplified schema fetch
        const tableObj = (schema as any)[intent.table];
        const columns = Object.keys(tableObj).filter(key => key !== '_' && typeof tableObj[key] === 'object');
        return { success: true, data: columns };

      case 'fetch':
        if (!intent.table) throw new Error('Table name required');
        let query = `SELECT * FROM ${intent.table}`;
        if (intent.id) {
          query += ` WHERE id = ${parseInt(intent.id)}`;
        }
        query += ` LIMIT ${intent.limit || 10} OFFSET ${intent.offset || 0}`;
        
        const data = await db.execute(sql.raw(query));
        return { success: true, data };

      default:
        return { success: false, error: 'Unknown intent' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
