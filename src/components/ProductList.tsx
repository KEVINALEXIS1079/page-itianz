"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

export function ProductList({ products, categories }: { products: any[], categories: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts = products.filter(p => {
    if (selectedCategory === "all") return true;
    return p.categoryId === selectedCategory;
  });

  return (
    <div className="w-full">
      {/* Filtros */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${
              selectedCategory === "all" ? "bg-primary text-white" : "bg-default-100 hover:bg-default-200 text-default-600"
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                selectedCategory === cat.id ? "bg-primary text-white" : "bg-default-100 hover:bg-default-200 text-default-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-default-500"
        >
          No hay productos en esta categoría.
        </motion.p>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard item={item} resolvedImage={item.resolvedImage} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
