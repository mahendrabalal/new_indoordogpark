import { Metadata } from 'next';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import OptimizedImage from '@/components/OptimizedImage';
import AmazonProduct from '@/components/AmazonProduct';
import AdsterraBanner from '@/components/AdsterraBanner';

const safetyChecklist = [
  {
    title: 'Vaccination Verification',
    description: 'We prioritize parks that enforce core vaccine requirements (Rabies, DHPP, Bordetella) to ensure herd immunity.',
    icon: 'bi-shield-check',
  },
  {
    title: 'Breed & Temperament Checks',
    description: 'We note which facilities perform behavioral evaluations, separating high-energy players from shy or senior dogs.',
    icon: 'bi-heart-pulse',
  },
  {
    title: 'Facility Hygiene',
    description: 'Our listings track cleaning protocols and ventilation standards, crucial for preventing respiratory issues like CIRDC.',
    icon: 'bi-stars',
  },
  {
    title: 'Staff Training',
    description: 'We highlight venues with CPR-certified staff and trainers who use positive reinforcement methods.',
    icon: 'bi-mortarboard',
  },
];

const ownerProcess = [
  {
    step: '01',
    title: 'Find your perfect match',
    content: 'Not every park suits every dog. Use our filters to find spaces with <a href="/?amenities=rubber_flooring" class="text-violet-600 hover:underline">joint-friendly rubber flooring</a>, separate small-dog zones, or climate control for brachycephalic breeds.',
  },
  {
    step: '02',
    title: 'Verify requirements',
    content: 'Every listing clearly states entry rules. We check whether you need to upload vet records beforehand or if drop-ins are welcome, saving you a wasted trip.',
  },
  {
    step: '03',
    title: 'Visit with confidence',
    content: 'Access real-time tips from our community—like peak hours to avoid or parking secrets. After your visit, leave a review to help other owners.',
  },
];

export const metadata: Metadata = {
  title: 'How We Rank & Review Indoor Dog Parks | IndoorDogPark Standards',
  description: 'Learn about our rigorous 12-point safety check and how we review indoor dog parks for cleanliness, staff training, and vaccination policies.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How We Rank & Review Indoor Dog Parks | IndoorDogPark Standards',
    description: 'Learn about our rigorous 12-point safety check and how we review indoor dog parks for cleanliness, staff training, and vaccination policies.',
    url: 'https://www.indoordogpark.org/how-it-works',
    type: 'website',
    images: ['/images/hero/hero.webp'],
  },
};

export default function HowItWorksPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white md:py-32">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="inline-block rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-semibold text-violet-200 ring-1 ring-inset ring-violet-500/20 mb-6">
            The Ultimate Directory for Indoor Play
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl mb-6">
            Connecting dog families with<br />
            <span className="text-violet-400">trusted park owners.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
            IndoorDogPark is the trusted platform where dog owners find vetted safe spaces, and premium park businesses connect with their ideal customers.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:scale-105">
              Browse the directory
            </Link>
            <Link href="/list-your-park" className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10">
              List your business
            </Link>
          </div>
        </div>
      </section>

      {/* Adsterra Banner Ad - After Hero */}
      <AdsterraBanner />

      {/* Safety Standards Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 md:text-4xl mb-6">
                Understanding our listing types
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our directory features two types of parks. While all listings are reviewed for basic legitimacy, our <strong>Premium Partner Listings</strong> undergo a rigorous audit to ensure the highest safety standards.
              </p>

              <div className="mb-8 rounded-2xl bg-violet-50 p-6 border border-violet-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
                    <i className="bi bi-patch-check-fill text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Premium Standard</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  For our premium partners, we personally highlight these 4 pillars of safety before awarding the badge:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {safetyChecklist.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <i className={`bi ${item.icon} text-violet-600 shrink-0 mt-0.5`} />
                      <div>
                        <span className="block font-semibold text-slate-900 text-sm">{item.title}</span>
                        <span className="text-xs text-slate-500">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-500 italic">
                * Standard listings are community-submitted or public data and may not have been audited for these specific protocols. Always check individual listing details.
              </p>
            </div>

            <div className="relative h-[500px] w-full overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center p-8">
              {/* Visual comparison of listing types */}
              <div className="relative w-full max-w-md transform hover:scale-105 transition-transform duration-500">
                <OptimizedImage
                  src="/images/verified-listing-mockup.png"
                  alt="IndoorDogPark Verified Premium Listing Example"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <p className="inline-block bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-violet-700 shadow-sm border border-violet-100">
                    <i className="bi bi-eye-fill mr-2"></i>
                    What users see
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Journey Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl mb-4">How our platform works for you</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We bridge the gap between searching and playing. Here is how dog owners use our directory to find the clear choice.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

            {ownerProcess.map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg shadow-slate-200/50 mb-6 border-4 border-slate-50">
                  <span className="text-2xl font-bold text-violet-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p
                  className="text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex -space-x-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-500">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-slate-600">
                  <i className="bi bi-person-fill"></i>
                </div>
              </div>
              <p className="text-slate-700 font-medium">
                Helping over <span className="text-violet-700 font-bold">12,000+ dog owners</span> search for indoor dog parks here every month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Park Owners Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <div className="inline-block rounded-lg bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300 mb-6 w-fit">
                  For Business Owners
                </div>
                <h2 className="text-3xl font-bold mb-6">Do you set the standard for safety?</h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  We curate our directory carefully. If your facility prioritizes safety, hygiene, and staff training, we want to help you reach serious dog owners who value those standards.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-emerald-400 mt-1"></i>
                    <span className="text-slate-200">Get highlighted for specialized amenities (e.g. agility, dock diving)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-emerald-400 mt-1"></i>
                    <span className="text-slate-200">Attract owners who respect rules and vaccination policies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-emerald-400 mt-1"></i>
                    <span className="text-slate-200">Access our <Link href="/owner-resources" className="underline hover:text-white">owner insights dashboard</Link></span>
                  </li>
                </ul>
                <div>
                  <Link href="/list-your-park" className="inline-flex items-center rounded-full bg-emerald-500 px-8 py-3.5 font-bold text-slate-900 hover:bg-emerald-400 transition-colors">
                    Apply to be a Premium Partner
                  </Link>
                </div>
              </div>
              <div className="relative h-full min-h-[400px] w-full bg-slate-800">
                <OptimizedImage
                  src="/images/modern-indoor-dog-park-interior.png"
                  alt="Modern indoor dog park facility with agility equipment"
                  fill
                  className="object-cover h-full w-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-900/50 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Gear Section */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recommended Gear for Dog Owners</h2>
            <p className="text-lg text-slate-600">
              Essential tools for training and park visits, hand-picked by our team.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <AmazonProduct
              title="Raisingwell Dog Treat Pouch with Magnetic Closure"
              imageUrl="https://m.media-amazon.com/images/I/91Aw0aRTPGL._AC_SX679_.jpg"
              url="https://www.amazon.com/dp/B0DSVTQ9TY?tag=mahendrabalal-20"
              price="$13.29"
              benefits={[
                "Magnetic closure for quick access to treats",
                "Built-in poop bag dispenser",
                "includes clicker for training",
                "4 ways to wear (zipper, shoulder strap, waist belt, etc.)"
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ / Trust Signals */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Common questions from our community</h2>
          <div className="grid gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Why do you require vaccination proof for listings?</h3>
              <p className="text-slate-600 leading-relaxed">
                According to the <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">American Veterinary Medical Association (AVMA)</a>, communal dog environments are high-risk zones for disease transmission. We simply do not list venues that fail to mandate basic health protections.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg mb-2">Does &quot;Indoor&quot; mean climate-controlled?</h3>
              <p className="text-slate-600 leading-relaxed">
                Usually, yes. However, we specifically tag listings as &quot;Climate Controlled&quot; only if they have HVAC systems. Some converted warehouse spaces may be covered but not heated/cooled, so we review this detail explicitly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg mb-2">How do I report a safety concern?</h3>
              <p className="text-slate-600 leading-relaxed">
                Community vigilance is our second layer of defense. If you visit a Verified park and find standards slipping (e.g., dirty floors, inattentive staff), please <Link href="/contact" className="text-violet-600 hover:underline">contact our trust & safety team</Link> immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
