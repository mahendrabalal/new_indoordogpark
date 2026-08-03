import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Free Dog Tools & Calculators | IndoorDogPark.org',
  description: 'Use our free interactive tools and calculators to keep your dog happy and healthy. Dog exercise calculator, and more coming soon.',
  keywords: [
    'dog tools',
    'dog calculators',
    'dog exercise calculator',
    'pet health tools',
    'dog care tools',
  ],
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free Dog Tools & Calculators | IndoorDogPark.org',
    description: 'Interactive tools to help you keep your dog happy, healthy, and well-exercised.',
    url: 'https://www.indoordogpark.org/tools',
    type: 'website',
  },
};

const tools = [
  {
    title: 'Dog Exercise Calculator',
    description: 'Find out exactly how much daily physical and mental exercise your puppy, adult, or senior dog needs based on their age, size, and breed type.',
    href: '/tools/dog-exercise-calculator',
    icon: 'bi-lightning-charge-fill',
    color: 'from-blue-500 to-cyan-400',
    tag: 'Most Popular',
  },
  {
    title: 'Dog BMI & Healthy Weight Checker',
    description: 'Use the veterinary Body Condition Score (BCS) method to find out if your dog is at a healthy weight and calculate their ideal target weight.',
    href: '/tools/dog-bmi-calculator',
    icon: 'bi-speedometer2',
    color: 'from-orange-500 to-red-500',
    tag: 'New',
  },
  {
    title: 'Daily Dog Calorie & Portion Calculator',
    description: 'Find out exactly how many calories and cups of food your dog needs per day to stay at a healthy weight using veterinary RER formulas.',
    href: '/tools/dog-calorie-calculator',
    icon: 'bi-calculator-fill',
    color: 'from-emerald-500 to-teal-600',
    tag: 'New',
  },
  {
    title: 'Chocolate Toxicity Calculator',
    description: 'My dog ate chocolate — is it dangerous? Enter the type, amount, and your dog\'s weight to instantly assess the risk level and get emergency contacts.',
    href: '/tools/chocolate-toxicity-calculator',
    icon: 'bi-exclamation-triangle-fill',
    color: 'from-amber-800 to-amber-950',
    tag: 'New',
  },
  {
    title: 'Puppy Vaccination & Park Readiness',
    description: 'When is it safe to take your puppy to the dog park? Enter your puppy\'s birth date to get a custom timeline for shots and park safety.',
    href: '/tools/puppy-vaccination-calculator',
    icon: 'bi-calendar-heart-fill',
    color: 'from-indigo-600 to-blue-700',
    tag: 'Essential',
  },
  {
    title: 'Dog Park Etiquette Quiz',
    description: 'Take our 5-minute interactive quiz to test your dog park knowledge and earn your "Certified Good Human" badge!',
    href: '/tools/dog-park-etiquette-quiz',
    icon: 'bi-patch-check-fill',
    color: 'from-rose-500 to-pink-600',
    tag: 'Viral',
  },
  {
    title: 'The "Tire Out Your Dog" Space Estimator',
    description: 'Living in an apartment? Find out exactly how much open square footage your dog needs to safely play fetch or sprint.',
    href: '/tools/dog-space-estimator',
    icon: 'bi-rulers',
    color: 'from-slate-700 to-slate-900',
    tag: 'Popular',
  },
  {
    title: 'Weather Safety & Walk Calculator',
    description: 'Is it too hot or cold to walk your dog today? Enter your local temperature and dog\'s details to find out if it\'s safe to head outside.',
    href: '/tools/weather-safety-calculator',
    icon: 'bi-thermometer-half',
    color: 'from-sky-500 to-blue-600',
    tag: 'New',
  },
  {
    title: 'Dog Care Cost Calculator',
    description: 'Compare the true annual cost of doggy daycare, dog walkers, and indoor dog park memberships. Find out how much you could save!',
    href: '/tools/dog-socialization-cost-calculator',
    icon: 'bi-piggy-bank',
    color: 'from-emerald-600 to-green-700',
    tag: 'Popular',
  },
  {
    title: 'Dog Park Packing List',
    description: 'Create a custom, printable packing list for your next trip to the dog park based on weather, park type, and your dog\'s age.',
    href: '/tools/dog-park-packing-list-generator',
    icon: 'bi-card-checklist',
    color: 'from-purple-600 to-violet-800',
    tag: 'New',
  },
  {
    title: 'Dog Hydration Calculator',
    description: 'Find out exactly how many ounces and cups of water your dog should drink per day based on their weight, activity level, and local climate.',
    href: '/tools/dog-hydration-calculator',
    icon: 'bi-droplet-half',
    color: 'from-blue-500 to-cyan-500',
    tag: 'New',
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header variant="light" />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-hero-gradient text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Free Dog Tools &amp; Calculators
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Interactive tools built by dog lovers to help you make smarter decisions about your pet&apos;s health, exercise, and nutrition.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group block bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ${tool.href !== '#' ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-60 cursor-default pointer-events-none'}`}
                >
                  <div className={`bg-gradient-to-r ${tool.color} p-6 flex items-center justify-between`}>
                    <i className={`bi ${tool.icon} text-white text-4xl`}></i>
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {tool.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">
                      {tool.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                    {tool.href !== '#' && (
                      <div className="mt-4 text-secondary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Try it free <i className="bi bi-arrow-right"></i>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Have a Tool Idea?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              We&apos;re always looking for new tools to build for the dog owner community. If you have an idea, let us know!
            </p>
            <Link href="/contact" className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-xl hover:bg-secondary transition-colors">
              Suggest a Tool
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
