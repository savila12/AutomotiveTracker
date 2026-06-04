import { ServiceRecord } from '../types/models';

type CardStyle = { backgroundColor: string; borderColor: string };

const eventCardStyles: Record<string, CardStyle> = {
  fuel: { backgroundColor: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)' },
  maintenance: { backgroundColor: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' },
  repair: { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)' },
};

const defaultCardStyle: CardStyle = {
  backgroundColor: '#18181b',
  borderColor: '#27272a',
};

export const getHistoryEventCardStyle = (eventType: ServiceRecord['event_type']) => {
  return eventCardStyles[eventType] ?? defaultCardStyle;
};
