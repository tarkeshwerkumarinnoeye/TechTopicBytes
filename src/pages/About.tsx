import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 font-serif">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Welcome to our blogging platform, where ideas come to life and knowledge knows no bounds.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div className="bg-white p-8 rounded-xl shadow-soft">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  To create a space where knowledge sharing becomes an engaging and enriching experience for both writers and readers.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-soft">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600">
                  To build a community of passionate writers and curious readers who inspire and learn from each other.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-xl shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <ul className="space-y-4 text-gray-600">
                <li>✨ A beautiful, distraction-free writing experience</li>
                <li>📱 Responsive design that works on all devices</li>
                <li>🎨 Rich markdown support for expressive content</li>
                <li>💬 Engaging community features and discussions</li>
              </ul>
            </div>

            <div className="mt-12 bg-white p-8 rounded-xl shadow-soft">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900">Sarah Johnson</h3>
                  <p className="text-gray-600">Founder & CEO</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900">Michael Chen</h3>
                  <p className="text-gray-600">Lead Developer</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-900">Emma Davis</h3>
                  <p className="text-gray-600">Creative Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
