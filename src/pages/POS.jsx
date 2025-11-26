import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CartSidebar from "../components/CartSidebar";
import { ShoppingCart, Search, RefreshCw } from "lucide-react";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartPulse, setCartPulse] = useState(false);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);

  // Convert any date string to Sri Lanka time
  const toSriLankaTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      timeZone: "Asia/Colombo",
      hour12: false,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Verify Stripe payment if redirected back
  useEffect(() => {
    const verifyStripe = async () => {
      const url = new URL(window.location.href);
      const success = url.searchParams.get("stripe");
      const session_id = url.searchParams.get("session_id");

      if (success === "success" && session_id && !sessionStorage.getItem("stripeVerified")) {
        try {
          const res = await api.get(`/sales/verify?session_id=${session_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          alert(`Card Payment Successful!\nSale ID: ${res.data.saleId}\nTime: ${toSriLankaTime(res.data.createdAt)}`);
          setCart([]);
          await fetchProducts();
          sessionStorage.setItem("stripeVerified", "true"); // prevents double checkout
        } catch (err) {
          alert(err.response?.data?.msg || err.message);
        }
      }
    };
    verifyStripe();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (p) => {
    if (p.stock === 0) return;
    setCart(c => {
      const found = c.find(x => x.product === p._id);
      if (found) return c.map(x => x.product === p._id ? { ...x, qty: x.qty + 1, createdAt: new Date() } : x);
      return [...c, { product: p._id, name: p.name, price: p.price, qty: 1, stock: p.stock, createdAt: new Date() }];
    });
    setCartPulse(true);
    setTimeout(() => setCartPulse(false), 300);
    setIsCartOpen(true);
  };

  const inc = (id) => {
    const item = cart.find(i => i.product === id);
    if (item && item.qty < item.stock) {
      setCart(c => c.map(i => i.product === id ? { ...i, qty: i.qty + 1 } : i));
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 150);
    }
  };

  const dec = (id) => {
    setCart(c => c.flatMap(i => i.product === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]));
  };

  const removeItem = (id) => {
    setCart(c => c.filter(i => i.product !== id));
  };

  const checkout = async (paymentType) => {
    if (cart.length === 0) return alert("Cart empty");
    if (isCheckoutProcessing) return;

    setIsCheckoutProcessing(true);
    try {
      const payload = {
        items: cart.map(i => ({ product: i.product, name: i.name, price: i.price, qty: i.qty })),
        paymentType
      };

      const res = await api.post("/sales", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      // Card → redirect to Stripe Checkout
      if (paymentType === "card" && res.data.url) {
        window.location.href = res.data.url;
        return;
      }

      // Cash → complete sale
      alert(`Cash Payment Completed!\nSale ID: ${res.data.saleId}\nTime: ${toSriLankaTime(res.data.createdAt)}`);
      setCart([]);
      await fetchProducts();
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    } finally {
      setIsCheckoutProcessing(false);
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.qty, 0);
  const getTotalItems = () => cart.reduce((total, item) => total + item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Fitzone POS
            </h1>
            <p className="text-gray-600 mt-2">Point of Sale System</p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Cart Button */}
          <button
            className={`relative p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 ${cartPulse ? 'animate-pulse' : ''}`}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={24} />
            <div className="text-left">
              <div className="text-sm font-medium opacity-90">Total</div>
              <div className="text-lg font-bold">₨{getCartTotal().toFixed(2)}</div>
            </div>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 w-6 h-6 text-xs flex items-center justify-center rounded-full text-white font-bold border-2 border-white">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-card border-l-4 border-emerald-500">
            <div className="text-sm text-gray-600">Total Products</div>
            <div className="text-2xl font-bold text-gray-800">{products.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card border-l-4 border-blue-500">
            <div className="text-sm text-gray-600">In Cart</div>
            <div className="text-2xl font-bold text-gray-800">{getTotalItems()}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card border-l-4 border-amber-500">
            <div className="text-sm text-gray-600">Cart Total</div>
            <div className="text-2xl font-bold text-gray-800">₨{getCartTotal().toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card border-l-4 border-purple-500">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors w-full text-left"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              <div>
                <div className="text-sm">Refresh</div>
                <div className="text-lg font-bold">Products</div>
              </div>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-card">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filteredProducts.map(p => (
                <ProductCard key={p._id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )
        )}
      </div>

      <CartSidebar
        cart={cart}
        setCart={setCart}
        onInc={inc}
        onDec={dec}
        onRemove={removeItem}
        onCheckout={checkout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        toSriLankaTime={toSriLankaTime} // ✅ pass function
      />
    </div>
  );
}
