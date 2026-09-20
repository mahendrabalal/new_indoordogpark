import { Metadata } from 'next';
import PuppyVaccinationCalculator from '@/components/PuppyVaccinationCalculator';

export const metadata: Metadata = {
  title: 'Puppy Vaccination & Park Readiness Calculator Widget | IndoorDogPark.org',
  description: 'Free embeddable Puppy Vaccination Schedule & Dog Park Readiness Calculator widget powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PuppyVaccinationCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-3xl mx-auto">
        <PuppyVaccinationCalculator isEmbed={true} />
      </div>
    </main>
  );
}
