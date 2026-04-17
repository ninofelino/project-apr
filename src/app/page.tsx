import { getSalesCategories, getSalesProducts } from '../lib/sales-actions';
import CashierClient from './cashier-client';

export default async function CashierPage() {
  const categories = await getSalesCategories();
  const products = await getSalesProducts();

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transaksi Baru</h2>
          <p className="text-sm text-gray-500">Pilih produk untuk ditambahkan ke keranjang.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Sistem Online
          </span>
          <span className="text-gray-300">|</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
            {new Date().toLocaleDateString('id-ID')}
          </span>
        </div>
      </header>
      
      <div className="flex-1 min-h-0">
        <CashierClient initialProducts={products} initialCategories={categories} />
      </div>
    </div>
  );
}
