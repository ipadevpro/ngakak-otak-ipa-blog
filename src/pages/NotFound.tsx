
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6 max-w-md text-center">
          <div className="text-6xl font-bold mb-4 text-theme-purple">404</div>
          <h1 className="text-2xl font-bold mb-2">Waduh, halaman nggak ketemu!</h1>
          <p className="text-muted-foreground mb-8">
            Kayaknya halaman yang lo cari hilang ditelan black hole, atau jangan-jangan lo salah universe? 🌌
          </p>
          <Button asChild>
            <Link to="/">Balik ke Home</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
