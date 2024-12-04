import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
    categories: [
      { name: "Technology", href: "/category/technology" },
      { name: "Programming", href: "/category/programming" },
      { name: "AI & ML", href: "/category/ai-ml" },
      { name: "Web Development", href: "/category/web-dev" },
    ],
    social: [
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "GitHub", href: "#", icon: Github },
      { name: "LinkedIn", href: "#", icon: Linkedin },
      { name: "Email", href: "#", icon: Mail },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                TTB
              </span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your source for the latest insights in technology and programming.
              Stay updated with cutting-edge developments and expert tutorials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-purple-600 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-purple-600 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-500 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and articles.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Tech Topic Bytes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
