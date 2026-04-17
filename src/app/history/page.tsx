import { getSalesTransactions } from '../../lib/sales-actions';
import { Calendar, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

export default async function HistoryPage() {
  const transactions = await getSalesTransactions();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        <p className="text-gray-600">Review all past sales and payment details.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Transaction #</th>
                <th className="px-6 py-4 font-semibold">Payment Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="w-10 h-10 text-gray-200" />
                      <p>No transactions found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {new Date(trx.createdAt!).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">
                      {trx.transactionNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold uppercase">
                          {trx.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        {trx.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-gray-900">
                      Rp {parseFloat(trx.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
