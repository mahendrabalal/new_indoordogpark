import { Metadata } from 'next';
import DogWeatherSafetyCalculator from '@/components/DogWeatherSafetyCalculator';

export const metadata: Metadata = {
  title: 'Dog Weather Safety Calculator Widget | IndoorDogPark.org',
  description: 'Embeddable Dog Weather Safety Calculator widget powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function WeatherSafetyCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-4xl mx-auto">
        <DogWeatherSafetyCalculator isEmbed={true} />
      </div>
    </main>
  );
}
