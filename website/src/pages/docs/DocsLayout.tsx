import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Github } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { GITHUB_REPO, DOCS_NAV } from '@/lib/constants';

interface DocsLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function DocsLayout({ children, title, description }: DocsLayoutProps) {
  const location = useLocation();

  // Find prev/next pages
  const allPages = DOCS_NAV.flatMap(section => section.items);
  const currentIndex = allPages.findIndex(item => item.href === location.pathname);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{title}</span>
          </nav>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            {description && (
              <p className="text-xl text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>

          {/* Edit on GitHub */}
          <div className="mt-12 pt-8 border-t border-border">
            <a
              href={`https://github.com/${GITHUB_REPO}/edit/main/website/src/pages/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              Edit this page on GitHub
            </a>
          </div>

          {/* Prev/Next Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {prevPage ? (
              <Link
                to={prevPage.href}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {prevPage.label}
              </Link>
            ) : (
              <div />
            )}
            {nextPage && (
              <Link
                to={nextPage.href}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {nextPage.label}
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
