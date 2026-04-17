import * as schema from '../drizzle/schema';

export function getSchemaSummary() {
  const tables = Object.entries(schema)
    .filter(([key]) => !key.endsWith('Relations') && !key.endsWith('Enum'))
    .map(([name, table]: [string, any]) => {
      const columns = Object.keys(table).filter(key => key !== '_' && typeof table[key] === 'object');
      return `- ${name}: ${columns.join(', ')}`;
    });

  return `Available Tables and Columns:\n${tables.join('\n')}`;
}
