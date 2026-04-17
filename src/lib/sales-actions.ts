'use server';

import { db } from '../db';
import { 
  salesProducts, 
  salesCategories, 
  salesTransactions, 
  salesTransactionItems 
} from '../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSalesCategories() {
  return await db.select().from(salesCategories);
}

export async function getSalesProducts(categoryId?: number) {
  const query = db.select().from(salesProducts);
  if (categoryId) {
    return await query.where(eq(salesProducts.categoryId, categoryId));
  }
  return await query;
}

export async function createSalesCategory(name: string, description?: string) {
  const result = await db.insert(salesCategories).values({
    name,
    description,
  }).returning();
  revalidatePath('/pos');
  return result[0];
}

export async function createSalesProduct(data: {
  categoryId?: number;
  sku: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  imageUrl?: string;
}) {
  const result = await db.insert(salesProducts).values({
    ...data,
  }).returning();
  revalidatePath('/pos');
  revalidatePath('/pos/inventory');
  return result[0];
}

export async function updateSalesProduct(id: number, data: Partial<{
  categoryId?: number;
  sku: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  imageUrl?: string;
}>) {
  const result = await db.update(salesProducts)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(salesProducts.id, id))
    .returning();
  revalidatePath('/pos');
  revalidatePath('/pos/inventory');
  return result[0];
}

async function sendDiscordNotification(transaction: any, items: any[], total: string, method: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  // Fetch product names for the notification
  const productIds = items.map(i => i.productId);
  const products = await db.select().from(salesProducts).where(sql`${salesProducts.id} IN (${sql.join(productIds, sql`, `)})`);
  
  const itemDetails = items.map(item => {
    const p = products.find(prod => prod.id === item.productId);
    const name = (p?.name || 'Unknown').padEnd(20, ' ');
    const qty = `x${item.quantity}`.padEnd(5, ' ');
    const price = `Rp ${parseFloat(item.subtotal).toLocaleString()}`.padStart(12, ' ');
    return `${name} ${qty} ${price}`;
  }).join('\n');

  const receiptContent = `\`\`\`
==========================================
            STRUK PENJUALAN
==========================================
No. TRX : ${transaction.transactionNumber}
Metode  : ${method}
Waktu   : ${new Date().toLocaleString('id-ID')}
------------------------------------------
${itemDetails}
------------------------------------------
TOTAL   : Rp ${parseFloat(total).toLocaleString().padStart(31, ' ')}
==========================================
        TERIMA KASIH ATAS KUNJUNGANNYA
==========================================
\`\`\``;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: "🚀 **Penjualan Baru Berhasil Dicatat!**",
        embeds: [{
          description: receiptContent,
          color: 0x00ff00,
          timestamp: new Date().toISOString()
        }]
      })
    });
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
}

export async function processCheckout(data: {
  paymentMethod: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: string;
    subtotal: string;
  }[];
  subtotalAmount: string;
  discountAmount: string;
  totalAmount: string;
  notes?: string;
}) {
  try {
    // 1. Create Transaction Header
    const transactionNumber = `TRX-${Date.now()}`;
    const [transaction] = await db.insert(salesTransactions).values({
      transactionNumber,
      subtotalAmount: data.subtotalAmount,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    }).returning();

    if (!transaction) throw new Error("Failed to create transaction record");

    // 2. Create Transaction Items & Deduct Stock
    // We run these in a loop since we cannot use a transaction block with neon-http
    for (const item of data.items) {
      await db.insert(salesTransactionItems).values({
        transactionId: transaction.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      });

      // Deduct Stock
      await db.update(salesProducts)
        .set({
          stock: sql`${salesProducts.stock} - ${item.quantity}`,
          updatedAt: new Date().toISOString()
        })
        .where(eq(salesProducts.id, item.productId));
    }

    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/inventory');

    // 3. Send notification (async)
    sendDiscordNotification(transaction, data.items, data.totalAmount, data.paymentMethod).catch(console.error);

    return transaction;
  } catch (error) {
    console.error("Checkout process failed:", error);
    throw error;
  }
}

export async function getSalesTransactions() {
  return await db.select().from(salesTransactions).orderBy(sql`${salesTransactions.createdAt} DESC`);
}
