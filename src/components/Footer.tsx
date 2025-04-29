
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} Ngakak Otak IPA Blog. Dibuat dengan <Heart className="inline h-4 w-4 text-red-500" /> untuk siswa yang pengen ketawa sambil belajar.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-center">
          <Link to="/" className="text-sm hover:underline hover:text-primary">
            Home
          </Link>
          <span className="hidden md:inline-block">•</span>
          <Link to="/topics" className="text-sm hover:underline hover:text-primary">
            Topik IPA
          </Link>
          <span className="hidden md:inline-block">•</span>
          <Link to="/about" className="text-sm hover:underline hover:text-primary">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
