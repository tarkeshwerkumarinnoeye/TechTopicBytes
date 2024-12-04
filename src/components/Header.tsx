import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const Header = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAdminStatus(user);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto px-4" ref={menuRef}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              TTB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Link */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-purple-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center text-gray-600 hover:text-purple-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              {user ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-center bg-purple-600 text-white hover:bg-purple-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};

export default Header;