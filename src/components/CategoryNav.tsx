"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllCategories } from "@/lib/categories";

export function CategoryNav() {
  const pathname = usePathname();
  const categories = getAllCategories();

  const isActive = (categoryId: string) => {
    return pathname === `/category/${categoryId}`;
  };

  const isHome = pathname === "/";

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          <Link
            href="/"
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isHome
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            All Posts
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive(category.id)
                  ? "text-white shadow-lg"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              }`}
              style={
                isActive(category.id)
                  ? {
                      backgroundColor: category.color,
                      boxShadow: `0 10px 25px -5px ${category.color}30`,
                    }
                  : {}
              }
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
