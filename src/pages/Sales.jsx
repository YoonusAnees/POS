import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSales = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/sales", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired or unauthorized. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const toSriLankaTime = dateStr =>
    new Date(dateStr).toLocaleString("en-GB", { timeZone: "Asia/Colombo" });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Sales History</h1>
      {sales.length === 0 ? (
        <Card>No sales yet</Card>
      ) : (
        <div className="grid gap-4">
          {sales.map(s => (
            <Card key={s._id}>
              <div className="flex justify-between">
                <div>
                  <div className="font-bold">Sale #{s.saleId}</div>
                  <div className="text-sm text-gray-500">
                    By: {s.cashier?.name || "Unknown"} • {toSriLankaTime(s.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600">₨{s.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{s.items.length} items</div>
                </div>
              </div>

              <div className="mt-3 border-t pt-3 space-y-2">
                {s.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">
                        ₨{it.price.toFixed(2)} × {it.qty}
                      </div>
                    </div>
                    <div className="font-bold text-emerald-600">₨{it.subTotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
