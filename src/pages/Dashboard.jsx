import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Package,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  BarChart3
} from "lucide-react";

/* ------------------- CHARTS ------------------- */
const BarChart = ({ data, color = "emerald" }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  return (
    <div className="flex items-end justify-between h-40 gap-2 pt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.label}</div>
          <div
            className={`w-full bg-${color}-500 rounded-t-lg transition-all duration-500 hover:opacity-80`}
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <div className="text-xs font-semibold text-gray-700 mt-1">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-40 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          fill="none"
          stroke="rgb(16,185,129)"
          strokeWidth="2"
          points={points}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return <circle key={index} cx={x} cy={y} r="2.5" fill="rgb(16,185,129)" />;
        })}
      </svg>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.map((item, index) => (
          <div key={index}>{item.label}</div>
        ))}
      </div>
    </div>
  );
};

/* ------------------- DASHBOARD ------------------- */

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    salesToday: 0,
    totalRevenue: 0,
    revenueToday: 0,
    products: 0,
    lowStock: 0,
    customers: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const toSriLankaTime = dateStr =>
    new Date(dateStr).toLocaleString("en-GB", { timeZone: "Asia/Colombo" });

  useEffect(() => {
    (async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          api.get("/sales"),
          api.get("/products")
        ]);

        const sales = salesRes.data;
        const todayStr = new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const salesToday = sales.filter(
          s => new Date(s.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" }) === todayStr
        ).length;

        const revenueToday = sales
          .filter(s => new Date(s.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" }) === todayStr)
          .reduce((sum, sale) => sum + sale.total, 0);

        const lowStock = productsRes.data.filter(p => p.stock < 10).length;

        const last7Days = [...Array(7)].map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date;
        }).reverse();

        const salesChartData = last7Days.map(date => {
          const dayStr = date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "Asia/Colombo" });
          const dateStr = date.toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });
          return {
            label: dayStr,
            value: sales.filter(
              s => new Date(s.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" }) === dateStr
            ).length
          };
        });

        const revenueChartData = last7Days.map(date => {
          const dayStr = date.toLocaleDateString("en-GB", { weekday: "short", timeZone: "Asia/Colombo" });
          const dateStr = date.toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });
          return {
            label: dayStr,
            value: sales
              .filter(s => new Date(s.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" }) === dateStr)
              .reduce((sum, sale) => sum + sale.total, 0)
          };
        });

        const recent = sales
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          totalSales: sales.length,
          salesToday,
          totalRevenue,
          revenueToday,
          products: productsRes.data.length,
          lowStock,
          customers: new Set(sales.map(s => s.cashier?._id)).size
        });

        setRecentSales(recent);
        setSalesData(salesChartData);
        setRevenueData(revenueChartData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const statCards = [
    { label: "Total Revenue", value: `₨${stats.totalRevenue.toFixed(2)}`, change: "+12%", trend: "up", color: "emerald", icon: DollarSign },
    { label: "Sales Today", value: stats.salesToday, change: "+5%", trend: "up", color: "blue", icon: ShoppingBag },
    { label: "Total Products", value: stats.products, change: "+2%", trend: "up", color: "purple", icon: Package },
    { label: "Low Stock Alerts", value: stats.lowStock, change: stats.lowStock > 0 ? "Need attention" : "All good", trend: stats.lowStock > 0 ? "down" : "up", color: stats.lowStock > 0 ? "red" : "gray", icon: AlertTriangle }
  ];

  const quickActions = [
    { title: "Point of Sale", description: "Process new sales", icon: ShoppingBag, link: "/pos", color: "emerald" },
    { title: "Manage Products", description: "View and edit products", icon: Package, link: "/products", color: "blue" },
    { title: "Sales Report", description: "View sales analytics", icon: BarChart3, link: "/sales", color: "purple" },
    { title: "User Management", description: "Manage system users", icon: Users, link: "/users", color: "amber" }
  ];

  const filteredQuickActions = user?.role === "cashier"
    ? quickActions.filter(a => a.title !== "Manage Products" && a.title !== "User Management")
    : quickActions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} hover="lift" className={`border-l-4 border-l-${stat.color}-500`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                      <div className={`flex items-center gap-1 text-xs mt-1 ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                        {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader title="Sales Trend" description="Last 7 days sales" action={<Link to="/sales" className="text-emerald-600 text-sm">View →</Link>} />
            <CardContent><BarChart data={salesData} color="emerald" /></CardContent>
          </Card>
          <Card>
            <CardHeader title="Revenue Trend" description="Last 7 days revenue" action={<Link to="/sales" className="text-emerald-600 text-sm">View →</Link>} />
            <CardContent><LineChart data={revenueData} /></CardContent>
          </Card>
        </div>

        {/* QUICK ACTIONS + RECENT SALES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-3">
                {filteredQuickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.link} className="flex items-center gap-4 p-3 rounded-xl border hover:bg-emerald-50 transition-all">
                      <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${action.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Recent Sales" description="Latest transactions" action={<Link to="/sales" className="text-emerald-600 text-sm">View →</Link>} />
            <CardContent>
              {recentSales.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3" />
                  No recent sales
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSales.map(sale => (
                    <div key={sale._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Sale #{sale.saleId}</div>
                          <div className="text-sm text-gray-500">
                            {toSriLankaTime(sale.createdAt)} • {sale.items.length} items
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">₨{sale.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{sale.paymentType}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* LOW STOCK ALERT */}
        {stats.lowStock > 0 && (
          <Card className="mt-6 border border-amber-300 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <div className="font-semibold text-amber-800">
                  Stock Alert: {stats.lowStock} product{stats.lowStock > 1 ? "s" : ""} running low
                </div>
                <Link to="/products" className="text-amber-700 underline">Manage inventory →</Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
