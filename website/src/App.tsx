import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';

const Home = lazy(() => import('@/pages/Home'));
const Introduction = lazy(() => import('@/pages/docs/Introduction'));
const Installation = lazy(() => import('@/pages/docs/Installation'));
const QuickStart = lazy(() => import('@/pages/docs/QuickStart'));
const APIOverview = lazy(() => import('@/pages/api/Overview'));
const Examples = lazy(() => import('@/pages/Examples'));
const Plugins = lazy(() => import('@/pages/Plugins'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Introduction />} />
          <Route path="/docs/introduction" element={<Introduction />} />
          <Route path="/docs/installation" element={<Installation />} />
          <Route path="/docs/quick-start" element={<QuickStart />} />
          <Route path="/api" element={<APIOverview />} />
          <Route path="/api/overview" element={<APIOverview />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/plugins" element={<Plugins />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
