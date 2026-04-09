import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ["Home", "About", "Markets", "FAQ", "Contact"];
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="font-heading text-xl font-bold">
          <span className="text-foreground">Crypto</span>
          <span className="text-primary">ExperTrade</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut size={16} className="mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Open Account
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-card border-t border-border/30 px-4 pb-4 space-y-3">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="block text-sm text-muted-foreground py-2">
              {link}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            {user ? (
              <Button variant="ghost" size="sm" className="flex-1" onClick={handleSignOut}>
                <LogOut size={16} className="mr-1" /> Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button size="sm" className="flex-1" onClick={() => navigate("/auth")}>
                  Open Account
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
