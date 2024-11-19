import Aside from "../components/Aside";
import Chart from "../components/Chart";
import Header from "../components/Header";
import Table from "../components/Table";

function AdminDashboard() {
  return (
    <div className="bg-[#E7E7E3] min-h-screen flex ">
      <Aside />
      <main className="w-full pl-[260px]">
        <Header />
        <div className="p-5 pt-[106px]">
          <div>
            <h2 className="text-[24px] font-bold">Dashboard</h2>
            <span className="text-[16px]">
              Home <i className="fa-solid fa-angle-right text-sm"></i> Dashboard
            </span>
          </div>
        </div>

        <div className="flex w-full px-5 gap-5">
          <div className="w-full rounded-3xl overflow-hidden bg-white p-5">
            <Chart/>
          </div>
          <div className="flex-1 min-w-[360px] rounded-3xl bg-white">
            <div className="flex justify-between px-5 py-7 relative">
              <h2 className="font-bold text-[20px]">Best Products</h2>
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-[#232321]"></div>
            </div>

            <div>
              <div className="p-5 text-[16px] font-semibold flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-[64px] h-[64px] bg-[#c8c8c8] rounded-xl"></div>
                  <div className="flex flex-col">
                    <span>Lorem Ipsum</span>
                    <span className="text-[14px]">₹126.500</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold block">₹126.50</span>
                  <span className="text-[14px]">999 sales</span>
                </div>
              </div>

              <div className="p-5 text-[16px] font-semibold flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-[64px] h-[64px] bg-[#c8c8c8] rounded-xl"></div>
                  <div className="flex flex-col">
                    <span>Lorem Ipsum</span>
                    <span className="text-[14px]">₹126.500</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold block">₹126.50</span>
                  <span className="text-[14px]">999 sales</span>
                </div>
              </div>

              <div className="p-5 text-[16px] font-semibold flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-[64px] h-[64px] bg-[#c8c8c8] rounded-xl"></div>
                  <div className="flex flex-col">
                    <span>Lorem Ipsum</span>
                    <span className="text-[14px]">₹126.500</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold block">₹126.50</span>
                  <span className="text-[14px]">999 sales</span>
                </div>
              </div>
              <div className="p-5 text-[16px] font-semibold flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-[64px] h-[64px] bg-[#c8c8c8] rounded-xl"></div>
                  <div className="flex flex-col">
                    <span>Lorem Ipsum</span>
                    <span className="text-[14px]">₹126.500</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold block">₹126.50</span>
                  <span className="text-[14px]">999 sales</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <button className="px-6 py-2 rounded-xl bg-black text-white">
                Report
              </button>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Table pageName="Recent Orders" headings={["Poduct","Order Id","Date","Customer Name","Status","Amount"]}/>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
