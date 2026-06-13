import React from 'react';

interface CityPricingSummaryProps {
  cityName: string;
}

export default function CityPricingSummary({ cityName }: CityPricingSummaryProps) {
  return (
    <div className="city-pricing-summary" style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="bi bi-wallet2" style={{ color: '#6366f1' }} />
        Average Pricing in {cityName}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day Pass</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: '0.25rem' }}>$10 - $25</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Per dog, per visit</div>
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Membership</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: '0.25rem' }}>$30 - $60</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Unlimited visits + perks</div>
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vaccinations</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bi bi-shield-check text-green-500" /> Required
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Rabies, Bordetella, DHPP</div>
        </div>

      </div>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic', margin: '1rem 0 0 0' }}>
        * Prices vary by facility. Please check individual park listings for exact pricing and vaccination requirements.
      </p>
    </div>
  );
}
