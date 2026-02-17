'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraBanner() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    useEffect(() => {
        // Prevent duplicate script injection
        if (scriptLoadedRef.current || !containerRef.current) return;
        scriptLoadedRef.current = true;

        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src =
            'https://pl28732835.effectivegatecpm.com/c279a4a190894d2ae7272e964aada6d0/invoke.js';

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                textAlign: 'center',
                padding: '16px 0',
                overflow: 'hidden',
            }}
        >
            <div id="container-c279a4a190894d2ae7272e964aada6d0" />
        </div>
    );
}
