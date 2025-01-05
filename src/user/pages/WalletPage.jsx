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
    <div className="pt-[200px] flex justify-center">
      <Header />
      <main className="2xl:w-[70%] w-[87%] flex gap-10">
        <div className="xl:w-[340px] w-[280px] h-full">
          <UserProfileAside />
        </div>
        <div className="flex flex-col items-center gap-11 border xl:px-10 px-5 py-5 flex-1">
          <h2 className="text-[20px] font-bold uppercase">my wallet</h2>
          <div className="w-full flex gap-20 xl:max-w-[90%] max-w-full">
            <div className="flex-1 flex flex-col items-center gap-10">
              <div>
                <img src={walletImage} alt="" />
              </div>
              <div className="w-full shadow-lg border p-3 flex flex-col items-center gap-5">
                <h3 className="text-[20px] font-semibold">My Balance</h3>
                <h1 className="text-[44px] text-green-500 font-bold">
                  ₹ {(wallet && Math.round(wallet.balance)) || 0}
                </h1>
              </div>
            </div>
            <div className="border shadow-lg p-5 flex flex-col gap-3">
              <div>
                <h3 className="text-[20px] font-bold text-[#3C3633]">
                  Payment Method
                </h3>
                <span className="text-[#3C3633] font-medium">
                  Select any payment method
                </span>
              </div>
              <div className="flex flex-col items-start gap-3 mt-3">
                <div>
                  <input name="payment" type="radio" />
                  <label className="ml-3">Debit Card / Credit card</label>
                </div>
                <div>
                  <input name="payment" type="radio" />
                  <label className="ml-3">UPI Method</label>
                </div>
                <div>
                  <input name="payment" type="radio" />
                  <label className="ml-3">Internet Banking</label>
                </div>
                <button className="w-full mt-3 py-2 rounded-lg bg-black text-white">
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-5 bg-[#e4e4e4] rounded-lg p-5 text-center">
            {wallet?.histories?.length ? (
              wallet.histories.map((history) => (
                <div
                  key={history._id}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span>{history.remark}</span>
                    <span className="text-[#4a4a4a] text-[14px]">
                      {createDate(history.date)}
                    </span>
                  </div>
                  <span
                    className={`text-${
                      history.type === "Credit" ? "green" : "red"
                    }-500`}
                  >
                    {getAmount(history)}
                  </span>
                </div>
              ))
            ) : (
              <h2 className="text-[16px] font-medium ">No History !</h2>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default WalletPage;
