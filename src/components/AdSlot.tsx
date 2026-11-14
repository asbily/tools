import React from 'react';

export type AdSlotType =
  | '728x90'
  | '300x250'
  | '320x50'
  | '468x60'
  | '160x600'
  | '160x300'
  | 'native'
  | 'responsive-header'
  | 'in-feed-banner'
  | 'in-feed-card';

interface AdSlotProps {
  type?: AdSlotType;
  className?: string;
  slotName?: string;
}

// Local-first policy: external third-party ad network scripts are disabled.
export const AdSlot: React.FC<AdSlotProps> = () => null;
