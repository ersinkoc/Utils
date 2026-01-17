import { Link, useLocation } from 'react-router-dom';
import { DOCS_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 space-y-6 pr-4">
        {DOCS_NAV.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-sm mb-2">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "block px-3 py-1.5 text-sm rounded-md transition-colors",
                      location.pathname === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
