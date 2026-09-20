import { Metadata } from 'next';
import DogBmiCalculator from '@/components/DogBmiCalculator';

export const metadata: Metadata = {
  title: 'Dog BMI & Healthy Weight Calculator Widget | IndoorDogPark.org',
  description: 'Free embeddable Dog BMI and Body Condition Score (BCS) calculator widget powered by IndoorDogPark.org.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function DogBmiCalculatorEmbedPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-2 sm:p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-3xl mx-auto">
        <DogBmiCalculator isEmbed={true} />
      </div>
    </main>
  );
}
