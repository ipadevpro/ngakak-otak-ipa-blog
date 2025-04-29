
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Beaker } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { currentUser, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Beaker className="h-6 w-6 text-theme-purple" />
          <span className="text-xl font-bold text-foreground hidden sm:inline-block">Ngakak Otak IPA</span>
          <span className="text-xl font-bold text-foreground sm:hidden">NOI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/topics" className="text-sm font-medium hover:text-primary transition-colors">
            Topik IPA
          </Link>
          {isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Admin</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/admin">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                Admin Only 😎
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
