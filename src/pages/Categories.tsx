import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories-api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Categories = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getCategories(),
  });

  // Default category icons if not set in database
  const defaultIcons: { [key: string]: string } = {
    "Technology": "💻",
    "Programming": "👨‍💻",
    "AI & ML": "🤖",
    "Web Development": "🌐",
    "Mobile Development": "📱",
    "Cloud Computing": "☁️",
    "DevOps": "⚙️",
    "Cybersecurity": "🔒",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />
        <div className="container py-16 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>
          <div className="flex justify-center items-center">
            <div className="animate-pulse text-gray-500">Loading categories...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.error("Error loading categories:", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />
        <div className="container py-16 px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Categories</h1>
          <div className="text-center text-red-600">
            Error loading categories. Please try again later.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {/* Categories Header */}
      <section className="bg-white py-16">
        <div className="container px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Categories</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Explore our diverse range of tech topics and find the content that interests you the most
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories && categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                key={category.id}
                className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                  {category.icon || defaultIcons[category.name] || "📚"}
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {category.postCount || 0} articles
                </p>
              </Link>
            ))}
          </div>

          {categories && categories.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No categories found. Check back later!
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
