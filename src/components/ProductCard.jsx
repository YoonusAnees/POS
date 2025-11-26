import React, { useState } from "react";
import { Plus, ShoppingCart, Zap } from "lucide-react";

export default function ProductCard({ product, onAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const isLowStock = product.stock < 10 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock || isAdding) return;

    setIsAdding(true);
    onAdd(product);

    // Success feedback
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 
      hover:-translate-y-4 border border-gray-100 ${isOutOfStock ? 'opacity-70 saturate-50' : ''}`}
    >
      {/* Floating Badge */}
      {isLowStock && (
        <div className="absolute top-4 left-4 z-20 animate-pulse">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Zap size={14} />
            Almost Gone!
          </div>
        </div>
      )}

      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center">
          <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl">
            SOLD OUT
          </div>
        </div>
      )}

      {/* Image Container with Gradient Shine */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
        <div className="relative z-10">
          {/* Placeholder Image with 3D Tilt Effect */}
          <div className="w-40 h-40 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-700">
            <div className="text-6xl font-black text-emerald-600 opacity-20">
              {product.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 skew-x-12" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
        <div>
          <h3 className="font-black text-xl text-gray-800 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.sku && (
            <p className="text-xs text-gray-500 font-mono mt-1 tracking-wider">
              #{product.sku}
            </p>
          )}
        </div>

        {/* Price + Stock */}
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-600">
                RS {product.price.toFixed(0)}
              </span>
              <span className="text-lg font-bold text-gray-600">
                .{String(product.price.toFixed(2)).split('.')[1]}
              </span>
            </div>
            <p className={`text-sm font-bold mt-1 ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-gray-500'}`}>
              {isOutOfStock
                ? "• Out of Stock"
                : `${product.stock} units left`}
            </p>
          </div>

          {/* Add Button - The Star of the Show */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`relative overflow-hidden rounded-2xl px-8 py-4 font-bold text-white text-lg shadow-xl transition-all duration-300 
              ${isOutOfStock
                ? 'bg-gray-400 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-700 scale-95'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 shadow-2xl hover:shadow-emerald-500/50'
              }`}
          >
            {/* Animated Background Pulse */}
            {isAdding && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 animate-ping" />
            )}

            {/* Floating + Icon */}
            <span className="relative flex items-center gap-2 justify-center">
              {isAdding ? (
                <>
                  <ShoppingCart size={22} className="animate-bounce" />
                  Added!
                </>
              ) : (
                <>
                  <Plus size={26} className="font-black" />
                  Add
                </>
              )}
            </span>

            {/* Success Checkmark Burst */}
            {isAdding && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="text-white text-5xl animate-bounce">✓</div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    </div>
  );
}