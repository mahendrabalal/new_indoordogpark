import { Metadata } from 'next';
import DogCalorieCalculator from '@/components/DogCalorieCalculator';

export const metadata: Metadata = {
  title: 'Daily Dog Calorie Calculator Widget | IndoorDogPark.org',
  description: 'Free embeddable Dog Calorie and Feeding Portion Calculator widget powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DogCalorieCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-3xl mx-auto">
        <DogCalorieCalculator isEmbed={true} />
      </div>
    </main>
  );
}
