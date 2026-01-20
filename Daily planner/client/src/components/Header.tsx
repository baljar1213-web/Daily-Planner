import { format } from "date-fns";
import { Flame } from "lucide-react";

interface HeaderProps {
  streak: number;
}

export function Header({ streak }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs mb-1">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Daily Focus
          </h1>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
          <div className={`p-1 rounded-full ${streak > 0 ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-bold text-lg text-foreground leading-none block">{streak}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
