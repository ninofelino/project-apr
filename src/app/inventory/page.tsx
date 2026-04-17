import { getSalesCategories, getSalesProducts } from '../../lib/sales-actions';
import InventoryClient from './inventory-client';

export default async function InventoryPage() {
  const categories = await getSalesCategories();
  const products = await getSalesProducts();

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">Manage your product catalog and stock levels.</p>
        </div>
      </div>

      <InventoryClient initialCategories={categories} initialProducts={products} />
    </div>
  );
}
