'use client';

import { useState } from 'react';

type WeatherData = {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
};

type SafetyStatus = 'safe' | 'caution' | 'danger-hot' | 'danger-cold';

export default function WeatherSafetyChecker() {
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

    // Dynamic styles based on status
    const getTheme = (status: SafetyStatus | null) => {
        if (!status) return {
            gradient: 'from-blue-600 to-violet-600',
            shadow: 'shadow-indigo-500/20',
            icon: '🌥️',
        };
        switch (status) {
            case 'safe': return {
                gradient: 'from-emerald-500 to-teal-500',
                shadow: 'shadow-emerald-500/20',
                icon: '🎾',
                textColor: 'text-emerald-900',
                bgColor: 'bg-emerald-50',
                accentColor: 'text-emerald-600'
            };
            case 'caution': return {
                gradient: 'from-amber-400 to-orange-500',
                shadow: 'shadow-orange-500/20',
                icon: '🐾',
                textColor: 'text-orange-900',
                bgColor: 'bg-orange-50',
                accentColor: 'text-orange-600'
            };
            case 'danger-hot': return {
                gradient: 'from-rose-500 to-red-600',
                shadow: 'shadow-red-500/20',
                icon: '🔥',
                textColor: 'text-rose-900',
                bgColor: 'bg-rose-50',
                accentColor: 'text-rose-600'
            };
            case 'danger-cold': return {
                gradient: 'from-sky-500 to-blue-600',
                shadow: 'shadow-blue-500/20',
                icon: '🥶',
                textColor: 'text-sky-900',
                bgColor: 'bg-sky-50',
                accentColor: 'text-sky-600'
            };
        }
    };

    const theme = getTheme(safetyStatus);

    return (
        <div className="w-full max-w-5xl mx-auto my-8 px-4 relative z-10">
            {/* Main Card */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transform transition-all hover:shadow-2xl hover:shadow-slate-300/50 duration-500">
                <div className="flex flex-col md:flex-row min-h-[360px]">

                    {/* Left Side: Input & Intro */}
                    <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center relative overflow-hidden bg-white z-20">

                        <div className="mb-6 relative">
                            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                </span>
                                Live Safety Check
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                                Is it safe for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">paws to pause?</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium">
                                Don&apos;t guess. Check real-time pavement risk, heat index, and frostbite danger for your dog.
                            </p>
                        </div>

                        <form onSubmit={handleManualSearch} className="relative z-10 w-full">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-2">
                                    <div className="pl-4 text-slate-400">
                                        <i className="bi bi-geo-alt-fill text-xl"></i>
                                    </div>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter City or Zip Code..."
                                        className="w-full px-4 py-4 bg-transparent text-slate-900 placeholder-slate-400 font-semibold text-lg focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 bg-gradient-to-r ${theme.gradient} hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap`}
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Check <i className="bi bi-arrow-right"></i></>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <p className="text-rose-500 text-sm mt-4 ml-2 flex items-center gap-2 font-medium animate-fadeIn bg-rose-50 inline-block px-3 py-1 rounded-lg">
                                    <i className="bi bi-exclamation-circle-fill"></i> {error}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Right Side: Results Display */}
                    <div className={`md:w-1/2 relative flex items-center justify-center p-10 transition-all duration-700 overflow-hidden ${safetyStatus ? theme.bgColor : 'bg-slate-50'}`}>

                        {/* Background Shapes for visual interest */}
                        {!weather && (
                            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full blur-[100px] opacity-20"></div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        )}

                        {!weather ? (
                            // Empty State / Initial View - High Contrast Fix
                            <div className="relative z-10 text-center text-slate-400 max-w-xs mx-auto">
                                <div className="bg-white rounded-full p-8 inline-block shadow-sm mb-6 border border-slate-100">
                                    <div className="text-6xl grayscale opacity-50 filter">🐶</div>
                                </div>
                                <h3 className="text-slate-900 font-bold text-xl mb-2">Waiting for location...</h3>
                                <p className="text-slate-500 font-medium">Enter your city on the left to see if it&apos;s safe for a walk!</p>
                            </div>
                        ) : (
                            // Result View
                            <div className="relative z-10 w-full animate-slideUpFade">
                                <div className="text-center mb-10">
                                    <div className="inline-block text-8xl mb-6 drop-shadow-md filter hover:scale-110 transition-transform duration-300">
                                        {theme.icon}
                                    </div>
                                    <h3 className={`text-5xl font-black mb-4 ${theme.textColor} tracking-tight`}>
                                        {safetyStatus === 'safe' && 'Good to Go!'}
                                        {safetyStatus === 'caution' && 'Use Caution'}
                                        {safetyStatus === 'danger-hot' && 'Tooooo Hot!'}
                                        {safetyStatus === 'danger-cold' && 'Too Cold!'}
                                    </h3>

                                    <div className="flex justify-center flex-wrap gap-3">
                                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-black/5 shadow-sm">
                                            <i className="bi bi-cloud-sun text-slate-500"></i>
                                            <span className="font-bold text-slate-700">{weather.condition}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-black/5 shadow-sm">
                                            <i className="bi bi-droplet text-slate-500"></i>
                                            <span className="font-bold text-slate-700">{weather.humidity}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-start gap-1 mb-10 text-slate-900">
                                    <span className={`text-8xl font-black tracking-tighter ${theme.accentColor}`}>{Math.round(weather.temperature)}</span>
                                    <span className={`text-4xl font-bold mt-4 ${theme.textColor} opacity-60`}>°F</span>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-sm relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${theme.gradient}`}></div>
                                    <p className={`text-center font-bold text-lg leading-relaxed ${theme.textColor}`}>
                                        {safetyStatus === 'safe' && 'The pavement is cool. Enjoy your walk with your best friend! 🎾'}
                                        {safetyStatus === 'caution' && 'It\'s getting warm. Place your hand on the pavement for 7 seconds. If it hurts, it\'s too hot for paws.'}
                                        {safetyStatus === 'danger-hot' && '⚠️ Asphalt can burn paws instantly right now. Please keep them indoors or on grass only.'}
                                        {safetyStatus === 'danger-cold' && '❄️ Risk of frostbite is real. Keep walks very short or stick to indoor play.'}
                                    </p>
                                </div>

                                {safetyStatus !== 'safe' && (
                                    <div className="mt-8 text-center animate-bounce-subtle">
                                        <a
                                            href="#main-content"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                document.querySelector('.search-input-new')?.parentElement?.scrollIntoView({ behavior: 'smooth' });
                                                document.querySelector<HTMLInputElement>('.search-input-new')?.focus();
                                            }}
                                            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 transition-all text-lg group"
                                        >
                                            <i className="bi bi-house-heart-fill group-hover:text-red-400 transition-colors"></i> Find Indoor Park
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attribution */}
            <div className="text-center mt-6 flex justify-center items-center gap-2">
                <span className="h-px w-10 bg-slate-200"></span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Powered by Open-Meteo</span>
                <span className="h-px w-10 bg-slate-200"></span>
            </div>
        </div>
    );
}
