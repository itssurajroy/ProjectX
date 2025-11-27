import HeroCarousel from '@/components/home/hero-carousel';
import MediaTabs from '@/components/home/media-tabs';

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroCarousel />
      <div className="container mx-auto px-4">
        <MediaTabs />
      </div>
    </div>
  );
}
