import type { College, CivicTask } from '../types';
import { distanceKm } from '../utils';

export interface MatchResult {
  college: College;
  distance: number;
  score: number;
  reasons: string[];
}

/**
 * Demo/mock Smart Matching. NOT real AI — it is a transparent weighted
 * scoring formula (distance + available volunteers + previous participation +
 * specialization match). Labeled clearly in the UI as simulated.
 */
export function matchColleges(task: CivicTask, colleges: College[], limit = 3): MatchResult[] {
  const results: MatchResult[] = colleges.map((college) => {
    const distance = distanceKm(task.coords, college.coords);
    const distanceScore = Math.max(0, 100 - distance * 4);
    const volunteerScore = Math.min(40, (college.availableVolunteers / task.volunteers) * 30);
    const experienceScore = Math.min(20, college.previousParticipations * 1.2);
    const specMatch = college.specializations.includes(task.category) ? 15 : 0;
    const score = Math.round(distanceScore + volunteerScore + experienceScore + specMatch);

    const reasons: string[] = [];
    if (distance < 8) reasons.push(`Nearby — ${distance} km from site`);
    if (college.availableVolunteers >= task.volunteers) reasons.push(`${college.availableVolunteers} volunteers available`);
    if (specMatch) reasons.push(`Specializes in ${task.category}`);
    if (college.previousParticipations > 10) reasons.push(`${college.previousParticipations} past drives`);
    if (reasons.length === 0) reasons.push(`${distance} km away`);

    return { college, distance, score, reasons };
  });
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
