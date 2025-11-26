import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export default function CartSidebar({
  cart = [],
  onInc,
  onDec,
  onRemove,
  onCheckout,
  isOpen,
  onClose,
  toSriLankaTime
}) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // State to store the checkout time
  const [checkoutTime, setCheckoutTime] = useState(null);

  // Update checkout time when cart becomes empty after a sale
  useEffect(() => {
    if (cart.length === 0 && checkoutTime === null) {
      const now = new Date();
      setCheckoutTime(now.toISOString());
    }
  }, [cart]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingCart size={32} />
                {itemCount > 0 && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-black rounded-full w-8 h-8 flex items-center justify-center animate-bounce shadow-lg">
                    {itemCount}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Your Cart</h2>
                <p className="text-emerald-100 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all hover:scale-110">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-500">Your cart is empty</p>
              <p className="text-gray-400 mt-2">Add some gains to your cart!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 hover:border-emerald-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">₨{item.price.toFixed(2)} each</p>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Added: {toSriLankaTime(item.createdAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 shadow-inner">
                    <button onClick={() => onDec(item.product)} className="p-2 hover:bg-gray-200 rounded-full">
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="font-black text-lg w-10 text-center text-emerald-600">{item.qty}</span>
                    <button onClick={() => onInc(item.product)} className="p-2 hover:bg-emerald-100 rounded-full">
                      <Plus size={18} className="text-emerald-600 font-bold" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xl font-black text-emerald-600">₨{(item.price * item.qty).toFixed(2)}</div>
                  <button onClick={() => onRemove(item.product)} className="p-3 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Time */}
        {checkoutTime && cart.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Last checkout: {toSriLankaTime(checkoutTime)}
          </div>
        )}

        {/* Bottom Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                <p className="text-4xl font-black text-emerald-600 tracking-tight">₨{total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => {
                onCheckout("cash");
                setCheckoutTime(new Date().toISOString()); // set checkout time immediately
              }} className="py-5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105">
                Pay Cash
              </button>
              <button onClick={() => {
                onCheckout("card");
                setCheckoutTime(new Date().toISOString()); // set checkout time immediately
              }} className="py-5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:scale-105">
                Pay Card
              </button>
            </div>

            <div className="text-center mt-4 text-xs text-gray-500">
              Secure checkout • Instant receipt
            </div>
          </div>
        )}
      </div>
    </>
  );
}
