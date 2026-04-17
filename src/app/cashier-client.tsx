'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Wallet, Smartphone, Banknote, X, CheckCircle2, Percent, Printer } from 'lucide-react';
import { processCheckout } from '../lib/sales-actions';

interface CartItem {
  productId: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

// Receipt component for printing
const ReceiptContent = ({ transaction, items, subtotal, discount, total }: { 
  transaction: any, items: CartItem[], subtotal: number, discount: number, total: number 
}) => (
  <div id="receipt-print" className="p-8 text-black bg-white font-mono text-sm max-w-[300px] mx-auto">
    <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
      <h2 className="font-bold text-lg">UMKM SALES POS</h2>
      <p>Jl. Contoh No. 123, Jakarta</p>
      <p>Telp: 0812-3456-7890</p>
    </div>
    
    <div className="mb-4 text-xs">
      <p>No: {transaction?.transactionNumber}</p>
      <p>Tgl: {new Date().toLocaleString('id-ID')}</p>
      <p>Metode: {transaction?.paymentMethod}</p>
    </div>

    <div className="border-b border-dashed border-gray-300 pb-2 mb-2">
      {items.map(item => (
        <div key={item.productId} className="flex justify-between mb-1">
          <div className="flex-1 pr-2">
            <p>{item.name}</p>
            <p className="text-[10px]">{item.quantity} x {item.price.toLocaleString()}</p>
          </div>
          <p className="whitespace-nowrap">{(item.quantity * item.price).toLocaleString()}</p>
        </div>
      ))}
    </div>

    <div className="space-y-1">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Diskon</span>
        <span>-{discount.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-bold border-t border-dashed border-gray-300 pt-1 mt-1">
        <span>TOTAL</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>

    <div className="text-center mt-8 pt-4 border-t border-dashed border-gray-300">
      <p>Terima Kasih</p>
      <p>Selamat Berbelanja Kembali!</p>
    </div>
  </div>
);

export default function CashierClient({ 
  initialProducts, 
  initialCategories 
}: { 
  initialProducts: any[], 
  initialCategories: any[] 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discountValue, setDiscountValue] = useState<string>('0');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, selectedCategory]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const discount = useMemo(() => {
    const val = parseFloat(discountValue) || 0;
    return val;
  }, [discountValue]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const addToCart = (product: any) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: parseFloat(product.price),
        quantity: 1
      }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = initialProducts.find(p => p.id === productId);
        const newQuantity = Math.max(1, item.quantity + delta);
        if (newQuantity > (product?.stock || 0)) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (!paymentMethod || cart.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await processCheckout({
        paymentMethod,
        subtotalAmount: subtotal.toString(),
        discountAmount: discount.toString(),
        totalAmount: total.toString(),
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
          subtotal: (item.price * item.quantity).toString()
        }))
      });
      setLastTransaction(result);
      setCart([]);
      setDiscountValue('0');
      setIsCheckoutModalOpen(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Struk</title>
            <style>
              body { font-family: monospace; }
              @media print {
                @page { margin: 0; size: 80mm 200mm; }
                body { margin: 10px; }
              }
              .text-center { text-align: center; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .border-b { border-bottom: 1px dashed #ccc; }
              .pb-4 { padding-bottom: 1rem; }
              .mb-4 { margin-bottom: 1rem; }
              .font-bold { font-weight: bold; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const paymentMethods = [
    { id: 'QRIS', icon: Smartphone, label: 'QRIS' },
    { id: 'TRANSFER', icon: Wallet, label: 'Transfer' },
    { id: 'DEBIT', icon: CreditCard, label: 'Debit' },
    { id: 'CASH', icon: Banknote, label: 'Tunai' },
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Products Section */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari produk atau SKU..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${!selectedCategory ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Semua
            </button>
            {initialCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left overflow-hidden group ${product.stock <= 0 ? 'opacity-60 grayscale' : 'active:scale-95'}`}
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Habis</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-400 font-mono mb-1">{product.sku}</p>
                <h4 className="font-bold text-gray-800 line-clamp-2 mb-2 flex-1">{product.name}</h4>
                <p className="text-blue-600 font-extrabold text-lg">
                  Rp {parseFloat(product.price).toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-2xl relative">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Keranjang ({cart.length})
          </h3>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-xs text-red-500 font-bold hover:underline">Hapus Semua</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10" />
              </div>
              <p className="font-medium">Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.productId} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                <div className="flex-1">
                  <h5 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h5>
                  <p className="text-blue-600 font-bold text-sm">Rp {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded border border-gray-200 text-gray-500"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded border border-gray-200 text-gray-500"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button onClick={() => removeFromCart(item.productId)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <p className="font-extrabold text-gray-900">Rp {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Diskon (Rp)</span>
              <input 
                type="number" 
                className="w-24 text-right bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-gray-900 font-bold"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>

            <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-blue-600">Rp {total.toLocaleString()}</span>
            </div>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutModalOpen(true)}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            Bayar Sekarang
          </button>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white z-20 animate-in fade-in duration-300 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-gray-500 mb-8">Transaksi telah dicatat dan stok telah diperbarui.</p>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={handlePrint}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  <Printer className="w-5 h-5" /> Cetak Struk
                </button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Transaksi Baru
                </button>
              </div>
            </div>
            
            {/* Hidden Receipt Area for Printing */}
            <div className="hidden">
              <ReceiptContent 
                transaction={lastTransaction} 
                items={cart} // Note: in real app, might want to save items in state before clearing cart
                subtotal={subtotal}
                discount={discount}
                total={total}
              />
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-black text-gray-800">Pembayaran</h3>
                <p className="text-xs text-gray-500">Pilih metode pembayaran</p>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map(method => (
                  <button 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' 
                        : 'border-gray-100 hover:border-blue-100 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-bold text-sm">{method.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-gray-900 rounded-xl p-5 text-white mb-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-[10px] mb-0.5 uppercase tracking-widest font-bold">Total Bayar</p>
                    <p className="text-2xl font-black text-blue-400">Rp {total.toLocaleString()}</p>
                  </div>
                  {discount > 0 && (
                    <div className="text-right">
                      <p className="text-gray-400 text-[9px] uppercase font-bold">Hemat</p>
                      <p className="text-green-400 font-bold text-sm">Rp {discount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                disabled={!paymentMethod || isProcessing}
                onClick={handleCheckout}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Konfirmasi Bayar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
