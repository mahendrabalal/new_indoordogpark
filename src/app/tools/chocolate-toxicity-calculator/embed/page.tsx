import { Metadata } from 'next';
import ChocolateToxicityCalculator from '@/components/ChocolateToxicityCalculator';

export const metadata: Metadata = {
  title: 'Chocolate Toxicity Calculator Widget for Dogs | IndoorDogPark.org',
  description: 'Free embeddable Chocolate Toxicity Calculator for dogs powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ChocolateToxicityCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-4xl mx-auto">
        <ChocolateToxicityCalculator isEmbed={true} />
      </div>
    </main>
  );
}
