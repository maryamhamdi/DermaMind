import AllCategoriesScreen from "@/src/features/categories/screens/allCategories";
import getCategories from "@/src/features/categories/server/categories.action";

export default async function CategoriesPage() {
  const response = await getCategories();

  console.log("response =", response);

  return (
    <AllCategoriesScreen
      categories={response.data}
    />
  );
}