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
  const { isAdmin } = useAdminStatus(user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        toggleButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const MobileNavLinks = () => (
    <div 
      ref={mobileMenuRef}
      className={`
        absolute top-full right-0 w-64 
        bg-white shadow-lg rounded-lg border 
        md:hidden 
        transform transition-all duration-300 ease-in-out origin-top-right
        ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        overflow-hidden
        z-50
      `}
    >
      <div className="flex flex-col p-4 space-y-2">
        <Link 
          to="/" 
          className="px-3 py-2 hover:bg-gray-100 rounded-md text-gray-800 hover:text-purple-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className="px-3 py-2 hover:bg-gray-100 rounded-md text-gray-800 hover:text-purple-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className="px-3 py-2 hover:bg-gray-100 rounded-md text-gray-800 hover:text-purple-600"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </Link>
        {isAdmin && (
          <Link 
            to="/admin" 
            className="px-3 py-2 hover:bg-gray-100 rounded-md text-gray-800 hover:text-purple-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </Link>
        )}
        <div className="border-t my-2"></div>
        {user && (
          <Button
            variant="ghost"
            onClick={() => {
              handleSignOut();
              setIsMobileMenuOpen(false);
            }}
            className="w-full justify-start text-left px-3 py-2 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
        {!user && (
          <Button
            onClick={() => {
              setShowAuthModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold flex">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Tech</span>
            <span className="text-[#e74c3c]">Tonic</span>
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Bytes</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden relative">
          <Button 
            ref={toggleButtonRef}
            variant="outline" 
            size="icon"
            onClick={toggleMobileMenu}
            className="z-50"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <MobileNavLinks />
        </div>
      </div>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};

export default Header;