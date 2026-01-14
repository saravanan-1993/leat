import { CategoryForm } from "@/components/Dashboard/products/category/category-form";

export default async function ViewCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-5">
      <CategoryForm id={id} />
    </div>
  );
}
