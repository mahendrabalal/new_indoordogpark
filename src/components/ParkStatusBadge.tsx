'use client';

import { DogPark } from '@/types/dog-park';
import { getParkStatus, ParkStatusInfo } from '@/lib/park-hours';
import { useEffect, useState } from 'react';

interface ParkStatusBadgeProps {
  park: DogPark;
  showNextChange?: boolean;
}

export default function ParkStatusBadge({ park, showNextChange = true }: ParkStatusBadgeProps) {
  const [statusInfo, setStatusInfo] = useState<ParkStatusInfo>(() => getParkStatus(park));

  // Update status every minute to keep it real-time
  useEffect(() => {
    const updateStatus = () => {
      setStatusInfo(getParkStatus(park));
    };

    // Update immediately on mount
    updateStatus();

    // Update every minute
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, [park]);

  // Only hide if we truly have no hours data at all
  const hasHoursData = park.hours24x7 || (park.openingHours && Object.keys(park.openingHours).length > 0);
  
  if (statusInfo.status === 'unknown' && !hasHoursData) {
    return null;
  }
  
  // If status is unknown but we have hours data, default to closed
  // (This handles edge cases where hours parsing fails but hours exist)
  const effectiveStatus = statusInfo.status === 'unknown' ? 'closed' : statusInfo.status;

  const statusConfig = {
    open: {
      icon: 'bi-circle-fill',
      text: 'Open Now',
      className: 'status-open'
    },
    closed: {
      icon: 'bi-circle',
      text: 'Closed',
      className: 'status-closed'
    },
    '24/7': {
      icon: 'bi-circle-fill',
      text: 'Open 24/7',
      className: 'status-24x7'
    }
  };

  const config = statusConfig[effectiveStatus];

  return (
    <div className="park-status-display">
      <span className={`status-badge ${config.className}`}>
        <i className={`bi ${config.icon}`}></i>
        <span className="status-text">{config.text}</span>
      </span>
      {showNextChange && statusInfo.nextChange && (
        <p className="status-next-change">
          {statusInfo.nextChange}
        </p>
      )}
    </div>
  );
}

