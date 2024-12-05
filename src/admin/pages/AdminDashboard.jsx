import { useEffect, useState } from "react";
import {
  useGetDashboardDataQuery,
  useLazyGetChartDataQuery,
  useLazyGetOrderHistoriesQuery,
} from "../../services/adminFethApi";
import Aside from "../components/Aside";
import Chart from "../components/Chart";
import Header from "../components/Header";
import Table from "../components/Table";

function AdminDashboard() {
  const { data } = useGetDashboardDataQuery();
  const [fetchOrders] = useLazyGetOrderHistoriesQuery();
  const [getChart] = useLazyGetChartDataQuery();

  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPendingOrders, setTotoalPendingOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [active, setActive] = useState("products");
  const [orders, setOrders] = useState(null);
  const [sales, setSales] = useState(null);
  const [labels, setLables] = useState(null);
  const [filter,setFilter] = useState("weekly");
  const [graphType,setGraphType] = useState('Line');

  const limit = 10;

  // table cofigs
  const columns = [
    "productName",
    "_id",
    "createdAt",
    "shippingAddress.name",
    "usageLimit",
    "paymentStatus",
    "totalPrice",
  ];

  // to set dashboard data
  useEffect(() => {
    if (data) {
      setTotalProductsSold(data.data?.totalProductsSold || 0);
      setTotalOrders(data.data?.totalOrders || 0);
      setTotoalPendingOrders(data.data.totalPendingOrders || 0);
      setTotalRevenue(data.data.totalRevenue || 0);
      setTotalCustomers(data.data.totalCustomers || 0);
      setTopProducts(data.data.topProducts || []);
      setTopCategories(data.data.topCategories || []);
    }
  }, [data]);

  // function to fetch recend orders
  async function fetchRecentOrders() {
    try {
      const response = await fetchOrders({ limit }).unwrap();
      if (response) setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  }
  
  // to fetch recend orders
  useEffect(() => {
    fetchRecentOrders();
  }, []);

  async function fetchChartData() {
    try {
      const response = await getChart({filter}).unwrap();
      if (response) {
        setLables(response.data.labels);
        setSales(response.data.sales);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchChartData();
  },[filter]);

  function formatNumers(number) {
    let value = number;
    let unit = "";

    if (number >= 1000000000) {
      value = number / 1000000000;
      unit = "B";
    } else if (number >= 1000000) {
      value = number / 1000000;
      unit = "M";
    } else if (number >= 1000) {
      value = number / 1000;
      unit = "K";
    }

    if (unit) {
      return value.toFixed(1) + unit;
    }

    return value + unit;
  }

  console.log(sales);
  console.log(labels);

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
        <div className="flex flex-col items-center gap-5">
          <div className="w-full px-16 flex gap-20">
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3 items-center">
              <h2 className="text-[20px] font-bold">Total Orders</h2>
              <span className="text-[40px] font-extrabold">
                {formatNumers(totalOrders)}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3 items-center">
              <h2 className="text-[20px] font-bold">Total Revenue</h2>
              <span className="text-[40px] tracking-widest font-extrabold">
                ₹{formatNumers(totalRevenue)}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3 items-center">
              <h2 className="text-[20px] font-bold">Total Products</h2>
              <span className="text-[40px] font-extrabold">
                {formatNumers(totalProductsSold)}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3 items-center">
              <h2 className="text-[20px] font-bold">Total Pending Orders</h2>
              <span className="text-[40px] font-extrabold">
                {formatNumers(totalPendingOrders)}
              </span>
            </div>
            <div className="flex-1 bg-white p-3 rounded-lg shadow-lg flex flex-col gap-3 items-center">
              <h2 className="text-[20px] font-bold">Total Costomers</h2>
              <span className="text-[40px] font-extrabold">
                {formatNumers(totalCustomers)}
              </span>
            </div>
          </div>

          <div className="flex w-full px-8 gap-5">
            <div className="w-full flex flex-col relative rounded-3xl overflow-hidden bg-white p-5">
              <div className="w-fit absolute top-2 left-20 border border-black rounded-md px-5 py-2">
              <select
                name="targetId"
                onChange={(e) => setGraphType(e.target.value) }
                value={graphType}
                className="w-full  bg-transparent focus:outline-none"
              >
                <option value="Line">Line Graph</option>
                <option value="Bar">Bar Graph</option>
              </select>
            </div>
            <div className="w-fit absolute top-2 left-60 border border-black rounded-md px-5 py-2">
              <select
                name="targetId"
                onChange={(e) => setFilter(e.target.value) }
                value={filter}
                className="w-full  bg-transparent focus:outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
              { (labels && sales) && <Chart graphType={graphType} salesPerday={sales} labels={labels} />}
            </div>
            <div className="flex-1 min-w-[360px] rounded-3xl bg-white">
              <div className="flex justify-between px-5 py-7 relative">
                <button
                  onClick={() => setActive("products")}
                  className={`px-3 py-2 rounded-lg font-bold ${
                    active === "products" && "bg-black text-white"
                  }`}
                >
                  Best Products
                </button>
                <button
                  onClick={() => setActive("categories")}
                  className={`px-3 py-2 rounded-lg font-bold ${
                    active === "categories" && "bg-black text-white"
                  }`}
                >
                  Best Categories
                </button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-[#232321]"></div>
              </div>
              <div>
                {active === "products" &&
                  topProducts &&
                  topProducts.map((product) => (
                    <div
                      key={product._id}
                      className="p-5 text-[16px] font-semibold flex items-center justify-between"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="w-[64px] h-[64px] min-w-[64px] bg-[#c8c8c8] rounded-xl">
                          <img
                            className="w-full h-full"
                            src={product.image}
                            alt=""
                          />
                        </div>
                        <div className="max-w-[180px] truncate">
                          <span>{product._id}</span>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold block">
                          ₹{product.varient}
                        </span>
                        <span className="text-[14px]">
                          {product.totalSold} sales
                        </span>
                      </div>
                    </div>
                  ))}
                {active === "categories" &&
                  topCategories.map((category) => (
                    <div
                      key={category._id}
                      className="p-5 text-[16px] font-semibold flex items-center justify-between"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="max-w-[180px] truncate">
                          <span>{category._id}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[18px]">
                          {category.totalSold} sales
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="p-5">
          {orders && <Table
            pageName="Recent Orders"
            headings={[
              "Poduct",
              "Order Id",
              "Date",
              "Customer Name",
              "Status",
              "Amount",
            ]}
            data={orders}
            columns={columns}
          />}
        </div> */}
      </main>
    </div>
  );
}

export default AdminDashboard;
