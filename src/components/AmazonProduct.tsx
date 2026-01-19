import Image from 'next/image';

interface AmazonProductProps {
    title: string;
    imageUrl: string;
    url: string;
    price?: string;
    benefits?: string[];
}

export default function AmazonProduct({ title, imageUrl, url, price, benefits }: AmazonProductProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Product Image */}
                <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 p-4">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 200px"
                    />
                </div>

                {/* Product Details */}
                <div className="flex flex-1 flex-col text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>

                    {benefits && benefits.length > 0 && (
                        <ul className="mb-4 space-y-1 text-sm text-gray-600 text-left list-disc list-inside">
                            {benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
                        {price ? (
                            <span className="text-xl font-bold text-gray-900">{price}</span>
                        ) : (
                            <span className="hidden"></span>
                        )}

                        <a
                            href={url}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg bg-[#FF9900] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#FFAC31] focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:ring-offset-2 w-full sm:w-auto"
                        >
                            Check Price on Amazon
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-2" viewBox="0 0 16 16">
                                <path d="M4.5 11.5A.5.5 0 0 1 5 11h10a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm-2-4A.5.5 0 0 1 1 3h10a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </a>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        As an Amazon Associate I earn from qualifying purchases.
                    </p>
                </div>
            </div>
        </div>
    );
}
