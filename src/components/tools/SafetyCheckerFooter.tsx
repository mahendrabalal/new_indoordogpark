'use client';

import { useState } from 'react';

type WeatherData = {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
};

type SafetyStatus = 'safe' | 'caution' | 'danger-hot' | 'danger-cold';

export default function SafetyCheckerFooter() {
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [safetyStatus, setSafetyStatus] = useState<SafetyStatus | null>(null);
    const [error, setError] = useState('');

    const checkWeather = async (lat?: number, lon?: number, query?: string) => {
        setLoading(true);
        setError('');
        setWeather(null);
        setSafetyStatus(null);

        try {
            let latitude = lat;
            let longitude = lon;
            let locationName = query;

            if (query && (!latitude || !longitude)) {
                const geoRes = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
                );
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('Location not found');
                }

                latitude = geoData.results[0].latitude;
                longitude = geoData.results[0].longitude;
                locationName = `${geoData.results[0].name}, ${geoData.results[0].admin1 || ''}`;
                if (locationName) setLocation(locationName);
            }

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`
            );
            const data = await weatherRes.json();

            if (data.error) throw new Error('Weather data unavailable');

            const temp = data.current.temperature_2m;
            const humidity = data.current.relative_humidity_2m;
            const code = data.current.weather_code;
            const wind = data.current.wind_speed_10m;

            const weatherData: WeatherData = {
                temperature: temp,
                humidity: humidity,
                windSpeed: wind,
                condition: getWeatherCondition(code),
            };

            setWeather(weatherData);
            setSafetyStatus(calculateSafety(temp));

        } catch (err) {
            console.error(err);
            setError('Could not get weather. Please try a valid city or zip code.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) return;
        checkWeather(undefined, undefined, location);
    };

    const calculateSafety = (temp: number): SafetyStatus => {
        if (temp > 85) return 'danger-hot';
        if (temp > 75) return 'caution';
        if (temp < 25) return 'danger-cold';
        return 'safe';
    };

    const getWeatherCondition = (code: number): string => {
        if (code === 0) return 'Clear sky';
        if (code >= 1 && code <= 3) return 'Partly cloudy';
        if (code >= 45 && code <= 48) return 'Fog';
        if (code >= 51 && code <= 55) return 'Drizzle';
        if (code >= 61 && code <= 65) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 95) return 'Thunderstorm';
        return 'Cloudy';
    };

    const getTheme = (status: SafetyStatus | null) => {
        if (!status) return {
            gradient: 'from-indigo-600 via-purple-600 to-violet-600',
            shadow: 'shadow-indigo-500/30',
            icon: '🌥️',
        };
        switch (status) {
            case 'safe': return {
                gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
                shadow: 'shadow-emerald-500/30',
                icon: '✨',
                textColor: 'text-emerald-900',
                bgColor: 'bg-emerald-50',
                accentColor: 'text-emerald-600',
                borderColor: 'border-emerald-200'
            };
            case 'caution': return {
                gradient: 'from-amber-500 via-orange-500 to-rose-500',
                shadow: 'shadow-orange-500/30',
                icon: '⚡',
                textColor: 'text-orange-900',
                bgColor: 'bg-orange-50',
                accentColor: 'text-orange-600',
                borderColor: 'border-orange-200'
            };
            case 'danger-hot': return {
                gradient: 'from-rose-500 via-red-600 to-pink-600',
                shadow: 'shadow-red-500/30',
                icon: '🔥',
                textColor: 'text-rose-900',
                bgColor: 'bg-rose-50',
                accentColor: 'text-rose-600',
                borderColor: 'border-rose-200'
            };
            case 'danger-cold': return {
                gradient: 'from-sky-500 via-blue-600 to-indigo-600',
                shadow: 'shadow-blue-500/30',
                icon: '❄️',
                textColor: 'text-sky-900',
                bgColor: 'bg-sky-50',
                accentColor: 'text-sky-600',
                borderColor: 'border-sky-200'
            };
        }
    };

    const theme = getTheme(safetyStatus);

    return (
        <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 relative z-10">
                {/* Premium Card Container */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.005] transition-all duration-500">
                    <div className="grid md:grid-cols-2 gap-0 min-h-[320px]">

                        {/* Left Side: Input & Branding */}
                        <div className="p-6 md:p-8 flex flex-col justify-center relative bg-gradient-to-br from-white to-slate-50/50">
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-200/50 backdrop-blur-sm mb-4 w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-indigo-500 to-violet-500"></span>
                                </span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-black uppercase tracking-widest">Live Safety Check</span>
                            </div>

                            {/* Premium Headline */}
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-[1.1] tracking-tight">
                                Is it safe for<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 animate-gradient">
                                    paws to pause?
                                </span>
                            </h2>

                            <p className="text-slate-600 text-base leading-relaxed font-medium mb-5 max-w-md">
                                Don&apos;t guess. Check real-time pavement risk, heat index, and frostbite danger for your dog.
                            </p>

                            {/* Premium Search Form */}
                            <form onSubmit={handleManualSearch} className="relative w-full max-w-lg">
                                <div className="relative group">
                                    {/* Glow Effect */}
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-300 animate-tilt`}></div>

                                    {/* Input Container */}
                                    <div className="relative flex items-center bg-white rounded-xl shadow-lg border-2 border-slate-100 focus-within:border-indigo-300 focus-within:shadow-xl focus-within:shadow-indigo-500/20 transition-all duration-300 overflow-hidden">
                                        <div className="pl-4 pr-2 text-slate-400">
                                            <i className="bi bi-geo-alt-fill text-xl"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Enter City or Zip Code..."
                                            className="flex-1 px-3 py-3 bg-transparent text-slate-900 placeholder-slate-400 font-semibold text-base focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`m-1.5 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r ${theme.gradient} hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 whitespace-nowrap relative overflow-hidden group`}
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="relative text-sm">Checking...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative text-sm">Check</span>
                                                    <i className="bi bi-arrow-right text-base relative"></i>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {error && (
                                    <p className="text-rose-600 text-sm mt-4 ml-2 flex items-center gap-2 font-bold animate-fadeIn bg-rose-50 inline-flex px-4 py-2 rounded-xl border border-rose-200">
                                        <i className="bi bi-exclamation-triangle-fill"></i> {error}
                                    </p>
                                )}
                            </form>
                        </div>

                        {/* Right Side: Results Display */}
                        <div className={`relative flex items-center justify-center p-6 md:p-8 transition-all duration-700 ${safetyStatus ? theme.bgColor : 'bg-gradient-to-br from-slate-50 to-slate-100/50'}`}>

                            {/* Decorative Elements */}
                            {!weather && (
                                <div className="absolute inset-0 overflow-hidden opacity-20">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full blur-[100px]"></div>
                                </div>
                            )}

                            {!weather ? (
                                // Waiting State - Premium
                                <div className="relative z-10 text-center max-w-xs">
                                    <div className="bg-white rounded-2xl p-6 inline-block shadow-lg mb-4 border border-slate-100 transform hover:rotate-3 transition-transform duration-300">
                                        <div className="text-5xl grayscale opacity-40">🐶</div>
                                    </div>
                                    <h3 className="text-slate-900 font-bold text-lg mb-2 tracking-tight">Waiting for location...</h3>
                                    <p className="text-slate-500 font-medium text-sm">Enter your city on the left to see if it&apos;s safe for a walk!</p>
                                </div>
                            ) : (
                                // Result View - Premium
                                <div className="relative z-10 w-full animate-slideUpFade">
                                    <div className="text-center mb-8">
                                        {/* Large Emoji Icon */}
                                        <div className="inline-block text-8xl md:text-9xl mb-6 drop-shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-bounce-subtle">
                                            {theme.icon}
                                        </div>

                                        {/* Status Title */}
                                        <h3 className={`text-5xl md:text-6xl font-black mb-6 ${theme.textColor} tracking-tight drop-shadow-sm`}>
                                            {safetyStatus === 'safe' && 'Perfect!'}
                                            {safetyStatus === 'caution' && 'Be Careful'}
                                            {safetyStatus === 'danger-hot' && 'Too Hot!'}
                                            {safetyStatus === 'danger-cold' && 'Too Cold!'}
                                        </h3>

                                        {/* Weather Badges */}
                                        <div className="flex justify-center flex-wrap gap-3 mb-6">
                                            <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-lg px-5 py-3 rounded-2xl border-2 border-black/5 shadow-lg">
                                                <i className="bi bi-cloud-sun text-slate-600 text-lg"></i>
                                                <span className="font-black text-slate-800">{weather.condition}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-lg px-5 py-3 rounded-2xl border-2 border-black/5 shadow-lg">
                                                <i className="bi bi-droplet-fill text-blue-500 text-lg"></i>
                                                <span className="font-black text-slate-800">{weather.humidity}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Temperature Display */}
                                    <div className="flex justify-center items-start gap-1 mb-5">
                                        <span className={`text-5xl md:text-6xl font-black tracking-tighter ${theme.accentColor} drop-shadow-lg`}>
                                            {Math.round(weather.temperature)}
                                        </span>
                                        <span className={`text-3xl font-black mt-2 ${theme.textColor} opacity-70`}>°F</span>
                                    </div>

                                    {/* Safety Message Card */}
                                    <div className={`bg-white/90 backdrop-blur-2xl rounded-2xl p-4 border ${theme.borderColor} shadow-lg relative overflow-hidden`}>
                                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.gradient}`}></div>
                                        <p className={`text-center font-semibold text-sm leading-relaxed ${theme.textColor} pl-2`}>
                                            {safetyStatus === 'safe' && '🎾 Perfect weather! The pavement is cool and safe. Enjoy your walk!'}
                                            {safetyStatus === 'caution' && '⚠️ Getting warm. Test the pavement with your hand for 7 seconds before walking.'}
                                            {safetyStatus === 'danger-hot' && '🚨 Danger! Asphalt can burn paws. Keep your dog indoors or on grass only.'}
                                            {safetyStatus === 'danger-cold' && '❄️ Frostbite risk! Keep walks very short or stick to indoor play.'}
                                        </p>
                                    </div>

                                    {/* CTA for unsafe conditions */}
                                    {safetyStatus !== 'safe' && (
                                        <div className="mt-5 text-center">
                                            <a
                                                href="/"
                                                className={`inline-flex items-center gap-2 bg-gradient-to-r ${theme.gradient} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadow} hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm group border border-white/20`}
                                            >
                                                <i className="bi bi-house-heart-fill text-base group-hover:scale-110 transition-transform"></i>
                                                Find Indoor Park
                                                <i className="bi bi-arrow-right text-sm transform group-hover:translate-x-1 transition-transform"></i>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attribution Badge - Premium */}
                <div className="text-center mt-4 flex justify-center items-center gap-2">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
                    <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                        Powered by Open-Meteo
                    </span>
                    <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"></span>
                </div>


            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                @keyframes tilt {
                    0%, 100% { transform: rotate(-1deg); }
                    50% { transform: rotate(1deg); }
                }
                .animate-tilt {
                    animation: tilt 3s ease-in-out infinite;
                }
                @keyframes slideUpFade {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUpFade {
                    animation: slideUpFade 0.6s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in;
                }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
