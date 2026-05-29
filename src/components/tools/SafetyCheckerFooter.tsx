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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 w-full transition-all duration-500 hover:shadow-md">
            
            {/* Header section matches the mockup UI */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100 mb-4">
                    <span className="text-orange-500">
                        <i className="bi bi-shield-check"></i>
                    </span>
                    <span className="text-orange-700 text-[11px] font-bold uppercase tracking-widest">Live Safety Check</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Is it safe for paws to pause?
                </h2>

                <p className="text-slate-500 text-sm leading-relaxed">
                    Did you know asphalt can be <strong className="text-slate-700">40°F hotter</strong> than the ambient air temperature? Enter your city or zip code below to instantly calculate the local <strong className="text-slate-700">Paw Soles Heat Index</strong>.
                </p>
            </div>

            {/* Premium Search Form inline */}
            <form onSubmit={handleManualSearch} className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter city (e.g., Austin, Phoenix, Seattle)..."
                            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Verify Safety'
                        )}
                    </button>
                </div>
                {error && (
                    <p className="text-rose-500 text-sm mt-3 flex items-center gap-2 font-medium">
                        <i className="bi bi-exclamation-circle-fill"></i> {error}
                    </p>
                )}
            </form>

            {/* Results or Helper Text */}
            {!weather ? (
                <div className="flex items-start gap-2 text-slate-400 mt-2">
                    <i className="bi bi-question-circle text-sm mt-0.5"></i>
                    <p className="text-xs">
                        Results will display temperature, pavement indexes, and air specifications.
                    </p>
                </div>
            ) : (
                <div className={`mt-6 p-6 rounded-xl border ${theme.borderColor} ${theme.bgColor} animate-slideUpFade`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="text-6xl drop-shadow-sm">
                            {theme.icon}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className={`text-2xl font-black mb-1 tracking-tight ${theme.textColor}`}>
                                {safetyStatus === 'safe' && 'Perfect Conditions!'}
                                {safetyStatus === 'caution' && 'Use Caution'}
                                {safetyStatus === 'danger-hot' && 'Too Hot for Paws!'}
                                {safetyStatus === 'danger-cold' && 'Too Cold!'}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3 text-sm font-bold text-slate-700">
                                <span>{Math.round(weather.temperature)}°F</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{weather.condition}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{weather.humidity}% Humidity</span>
                            </div>
                            <p className={`text-sm font-medium ${theme.textColor} opacity-90`}>
                                {safetyStatus === 'safe' && 'The pavement is cool and safe. Enjoy your walk!'}
                                {safetyStatus === 'caution' && 'Test the pavement with your hand for 7 seconds before walking.'}
                                {safetyStatus === 'danger-hot' && 'Asphalt can burn paws. Keep your dog indoors or on grass only.'}
                                {safetyStatus === 'danger-cold' && 'Frostbite risk! Keep walks very short or stick to indoor play.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUpFade {
                    animation: slideUpFade 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
