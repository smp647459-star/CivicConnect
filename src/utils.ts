export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10;
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/** Demo/mock AI: keyword-based categorization. Clearly simulated. */
export function aiCategorize(description: string): { category: string; priority: string } {
  const text = description.toLowerCase();
  const rules: { keywords: string[]; category: string; priority: string }[] = [
    { keywords: ['garbage', 'waste', 'dump', 'trash', 'litter'], category: 'Waste Management', priority: 'High' },
    { keywords: ['toilet', 'sanitation', 'urinal', 'sewage'], category: 'Sanitation', priority: 'High' },
    { keywords: ['drain', 'waterlogging', 'flood', 'storm water'], category: 'Drainage', priority: 'High' },
    { keywords: ['park', 'bench', 'playground', 'pathway'], category: 'Public Spaces', priority: 'Medium' },
    { keywords: ['tree', 'plant', 'garden', 'green'], category: 'Green Cover', priority: 'Medium' },
    { keywords: ['lake', 'river', 'pond', 'water body'], category: 'Water Bodies', priority: 'High' },
  ];
  for (const r of rules) {
    if (r.keywords.some((k) => text.includes(k))) {
      const priority = /critical|danger|urgent|severe/.test(text) ? 'Critical' : r.priority;
      return { category: r.category, priority };
    }
  }
  return { category: 'Waste Management', priority: 'Medium' };
}
