import { Metadata } from 'next';
import HydrationCalculator from '@/components/tools/HydrationCalculator';

export const metadata: Metadata = {
  title: 'Dog Hydration Calculator Widget | IndoorDogPark.org',
  description: 'Free embeddable Dog Hydration Calculator widget powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DogHydrationCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-4xl mx-auto">
        <HydrationCalculator isEmbed={true} />
      </div>
    </main>
  );
}
