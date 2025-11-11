import Link from "next/link";
import { getCategoryById } from "@/lib/categories";

type CategoryBadgeProps = {
  categoryId: string;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
};

export function CategoryBadge({
  categoryId,
  size = "md",
  clickable = true,
}: CategoryBadgeProps) {
  const category = getCategoryById(categoryId);

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const badge = (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-all ${sizeClasses[size]} ${
        clickable ? "hover:scale-105 cursor-pointer" : ""
      }`}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        borderColor: `${category.color}40`,
        borderWidth: "1px",
      }}
    >
      {category.name}
    </span>
  );

  if (clickable) {
    return <Link href={`/category/${category.id}`}>{badge}</Link>;
  }

  return badge;
}
