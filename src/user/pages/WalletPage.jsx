import Header from "../components/Header";
import UserProfileAside from "../components/UserProfileAside";
import walletImage from "../assets/image 3.svg";
import { useGetWalletQuery } from "../../services/userProfile";
import { useEffect, useState } from "react";

function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const { data: walletData } = useGetWalletQuery();

  useEffect(() => {
    if (walletData) setWallet(walletData.data);
  }, [walletData]);

  // function to create date
  function createDate(timeStamp) {
    const date = new Date(timeStamp);

    const formated = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formated;
  }

  function getAmount(history) {
    if (history.type === "Credit") {
      return "+" + Math.round(history.amount);
    } else {
      return Math.round(history.amount) * -1;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 md:pt-40 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-3 xl:col-span-3 sticky top-32 z-10">
             <UserProfileAside />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 xl:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[600px]">
               <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
                  My Wallet
               </h2>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 flex flex-col justify-between text-white shadow-xl min-h-[220px] relative overflow-hidden group">
                      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                      <div className="relative z-10">
                          <span className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2 block">Total Balance</span>
                          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                             ₹ {(wallet && Math.round(wallet.balance)) || 0}
                          </h1>
                      </div>
                      <div className="relative z-10 flex justify-between items-end">
                          <div className="flex flex-col">
                             <span className="text-gray-400 text-xs uppercase tracking-widest mb-1">Holder</span>
                             <span className="font-semibold tracking-wide">User Account</span>
                          </div>
                          <i className="fas fa-wallet text-white/20 text-4xl"></i>
                      </div>
                  </div>

                  {/* Add Money Section */}
                  <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col justify-between">
                      <div>
                          <h3 className="font-bold text-gray-900 mb-4">Add Money</h3>
                          <div className="space-y-3">
                              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-black transition-colors">
                                  <input name="payment" type="radio" className="accent-black h-4 w-4" />
                                  <span className="text-sm font-medium text-gray-700">Credit / Debit Card</span>
                              </label>
                              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-black transition-colors">
                                  <input name="payment" type="radio" className="accent-black h-4 w-4" />
                                  <span className="text-sm font-medium text-gray-700">UPI / Net Banking</span>
                              </label>
                          </div>
                      </div>
                      <button className="w-full mt-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-md">
                          Add Funds
                      </button>
                  </div>
               </div>

               {/* Transaction History */}
               <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h3>
                  <div className="flex flex-col gap-3">
                     {wallet?.histories?.length ? (
                        wallet.histories.map((history) => (
                           <div key={history._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-gray-200 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${history.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                      <i className={`fas fa-arrow-${history.type === 'Credit' ? 'down' : 'up'}`}></i>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="font-medium text-gray-900">{history.remark}</span>
                                      <span className="text-xs text-gray-500">{createDate(history.date)}</span>
                                  </div>
                              </div>
                              <span className={`font-bold text-lg ${history.type === 'Credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                  {getAmount(history)}
                              </span>
                           </div>
                        ))
                     ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                            <i className="fas fa-history text-2xl mb-2 opacity-50"></i>
                            <span className="text-sm">No transaction history found</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
