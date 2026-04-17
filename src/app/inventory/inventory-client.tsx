'use client';

import { useState } from 'react';
import { Plus, Search, Edit2, Package, Tag, Upload, X as CloseIcon } from 'lucide-react';
import { createSalesCategory, createSalesProduct, updateSalesProduct } from '../../lib/sales-actions';

export default function InventoryClient({ 
  initialCategories, 
  initialProducts 
}: { 
  initialCategories: any[], 
  initialProducts: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', categoryId: '', price: '', stock: '0', description: '', imageUrl: ''
  });
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSalesProduct({
      ...newProduct,
      categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId) : undefined,
      stock: parseInt(newProduct.stock),
    });
    setIsProductModalOpen(false);
    setNewProduct({ name: '', sku: '', categoryId: '', price: '', stock: '0', description: '', imageUrl: '' });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSalesCategory(newCategory.name, newCategory.description);
    setIsCategoryModalOpen(false);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Produk
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Kategori
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={activeTab === 'products' ? "Cari produk atau SKU..." : "Cari kategori..."}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => activeTab === 'products' ? setIsProductModalOpen(true) : setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah {activeTab === 'products' ? 'Produk' : 'Kategori'}
          </button>
        </div>

        {activeTab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Produk</th>
                  <th className="px-6 py-4 font-semibold">SKU</th>
                  <th className="px-6 py-4 font-semibold">Kategori</th>
                  <th className="px-6 py-4 font-semibold text-right">Harga</th>
                  <th className="px-6 py-4 font-semibold text-center">Stok</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 overflow-hidden">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description || 'Tidak ada deskripsi'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {initialCategories.find(c => c.id === product.categoryId)?.name || 'Tanpa Kategori'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">
                      Rp {parseFloat(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Nama Kategori</th>
                  <th className="px-6 py-4 font-semibold">Deskripsi</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center text-purple-600">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{cat.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">Tambah Produk Baru</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                    {newProduct.imageUrl ? (
                      <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Upload</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                  {newProduct.imageUrl && (
                    <button 
                      type="button"
                      onClick={() => setNewProduct({ ...newProduct, imageUrl: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
                <input required type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                  <input required type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                    <option value="">Pilih Kategori</option>
                    {initialCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                  <input required type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stok Awal</label>
                  <input required type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-200">Simpan Produk</button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">Tambah Kategori Baru</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600"><CloseIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kategori</label>
                <input required type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
                <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows={3} value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-200">Simpan Kategori</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
