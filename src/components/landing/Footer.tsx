import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">CM-SSA</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link>
            <Link to="/auth?mode=login" className="hover:text-foreground transition-colors">Login</Link>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CM-SSA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
