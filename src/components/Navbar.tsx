import { Film } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Film className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl tracking-wider text-foreground">
            CINE<span className="text-gradient-gold">PICK</span>
          </span>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Discover your next favorite film
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
