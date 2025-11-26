import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Plus, Search, Package, AlertTriangle, Edit3, Trash2, Loader2 } from "lucide-react";

export default function Products() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, sku: "", stock: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name and price required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/products", form);
      setForm({ name: "", price: 0, sku: "", stock: 0 });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await api.delete("/products/" + id);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-4">
          <Package className="text-emerald-600" size={40} />
          Manage Products
        </h1>
        <p className="text-gray-600 mt-2">Add, edit, and track your Pos inventory</p>
      </div>

      {/* Add Product Form – Glassmorphism Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Plus className="text-emerald-600" size={28} />
          Add New Product
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <input
            type="text"
            placeholder="Product Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
            required
          />
          <input
            type="text"
            placeholder="SKU (optional)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
          />
          <input
            type="number"
            placeholder="Price (₨)"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none font-medium"
            required
          />
          <input
            type="number"
            placeholder="Initial Stock"
            value={form.stock || ""}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
            className="px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
          />

          <div className="lg:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={26} className="font-black" />
                  Add Product
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-40 transition-opacity" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-lg"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <Package size={80} className="mx-auto text-gray-300 mb-6" />
            <p className="text-xl font-semibold text-gray-500">
              {searchTerm ? "No products found" : "No products yet"}
            </p>
            <p className="text-gray-400 mt-2">Start adding your first product above</p>
          </div>
        ) : (
          filteredItems.map((it) => {
            const isLowStock = it.stock < 10 && it.stock > 0;
            const isOutOfStock = it.stock === 0;

            return (
              <div
                key={it._id}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 ${
                  isOutOfStock
                    ? "border-red-200"
                    : isLowStock
                    ? "border-amber-200"
                    : "border-transparent"
                } overflow-hidden`}
              >
                {/* Stock Badge */}
                {isLowStock && (
                  <div className="absolute top-4 right-4 z-10 animate-pulse">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <AlertTriangle size={14} />
                      Low Stock
                    </div>
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-10 z-10 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl">
                      OUT OF STOCK
                    </div>
                  </div>
                )}

                {/* Product Card */}
                <div className="p-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl h-32 flex items-center justify-center mb-5">
                    <Package size={60} className="text-emerald-600 opacity-30" />
                  </div>

                  <h3 className="font-black text-xl text-gray-800 line-clamp-2">
                    {it.name}
                  </h3>
                  {it.sku && (
                    <p className="text-xs text-gray-500 font-mono mt-1">#{it.sku}</p>
                  )}

                  <div className="mt-5 flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black text-emerald-600">
                        ₨{it.price.toFixed(0)}
                        <span className="text-lg text-gray-600">.{String(it.price.toFixed(2)).split('.')[1]}</span>
                      </p>
                      <p className={`text-sm font-bold mt-2 ${
                        isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-gray-500"
                      }`}>
                        {it.stock} in stock
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => alert("Edit feature coming soon!")}
                        className="p-3 bg-gray-100 hover:bg-emerald-100 rounded-xl transition-all hover:scale-110"
                      >
                        <Edit3 size={20} className="text-emerald-600" />
                      </button>
                      <button
                        onClick={() => remove(it._id)}
                        className="p-3 bg-red-100 hover:bg-red-200 rounded-xl transition-all hover:scale-110"
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Glow */}
                <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}