import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Stats } from '@/components/home/Stats';
import { QuickExample } from '@/components/home/QuickExample';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <QuickExample />
    </>
  );
}
