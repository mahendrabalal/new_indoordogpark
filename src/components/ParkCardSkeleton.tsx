export default function ParkCardSkeleton() {
  return (
    <div className="park-card-new skeleton-card">
      <div className="park-card-image-wrapper">
        <div className="skeleton skeleton-image" />
      </div>

      <div className="park-card-body">
        {/* Type and Title */}
        <div className="park-card-header">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" style={{ width: '80%' }} />
        </div>

        {/* Location */}
        <div className="skeleton skeleton-text" style={{ marginTop: '12px', width: '60%' }} />

        {/* Badges */}
        <div className="park-card-badges">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-badge" />
        </div>

        {/* Rating */}
        <div className="skeleton skeleton-text" style={{ marginTop: '12px', width: '50%' }} />

        {/* Pricing */}
        <div className="skeleton skeleton-text" style={{ marginTop: '12px', width: '40%' }} />
      </div>
    </div>
  );
}
