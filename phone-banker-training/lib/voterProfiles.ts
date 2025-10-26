// Voter profile data - predefined personas for training

import { VoterProfile } from "@/types";

export const voterProfiles: VoterProfile[] = [
  // EASY PROFILES
  {
    id: "easy-1",
    name: "Working Mom - Queens Borough",
    difficulty: "easy",
    description: "Mid-40s retail worker juggling work and family life",
    age: "Mid-40s",
    location: "Queens",
    occupation: "Retail Worker",
    income: "Moderate",
    votingHistory: "Votes reliably but disengaged",
    keyIssues: [
      "Cost of living (rent/housing)",
      "Safe streets",
      "Reliable subway service for commute",
    ],
    skepticism:
      "Feels politicians promise 'things will improve' but nothing changes; may worry you're just 'another career politician'",
    personality:
      "Practical, tired, wants real solutions. Will listen but needs concrete examples of how you'll make her life easier.",
    vapiAssistantId: "ff352203-1fa8-45bd-ae02-0f33d3fa5162",
  },
  {
    id: "easy-2",
    name: "Small Business Owner - Brooklyn",
    difficulty: "easy",
    description: "Late 50s café owner, community-minded but tax-concerned",
    age: "Late 50s",
    location: "Brooklyn",
    occupation: "Café Owner",
    income: "Small business owner",
    votingHistory: "Long-time resident, reliable voter",
    keyIssues: [
      "High overhead costs",
      "Rising minimum wage concerns",
      "Crime and vandalism affecting business",
    ],
    skepticism:
      "Thinks candidates talk too much about 'big ideas' and not about how small business survives; maybe you're too big-government",
    personality:
      "Friendly but skeptical. Wants to hear about practical support for small businesses, not bureaucracy.",
      vapiAssistantId: "cadd4c1a-bc87-4832-851d-c4ece1460408",
    },
  {
    id: "easy-3",
    name: "Retired Senior - Staten Island",
    difficulty: "easy",
    description: "Early 70s retired public employee, values stability",
    age: "Early 70s",
    location: "Staten Island",
    occupation: "Retired Public Employee",
    income: "Fixed income",
    votingHistory: "Reliable voter, socially moderate to conservative",
    keyIssues: [
      "Property taxes",
      "Crime in neighborhood and subway",
      "City services being cut",
      "Feeling 'forgotten'",
    ],
    skepticism:
      "Thinks younger candidates don't respect 'how things used to be', worries you're from the 'political class'",
    personality:
      "Respectful but wants assurance that their concerns matter. Values experience and proven track records.",
      vapiAssistantId: "fceaa454-55f6-459a-a35b-c1d2a2bfcbc3",
  },

  // MEDIUM PROFILES
  {
    id: "medium-1",
    name: "Millennial Tech Worker - Manhattan",
    difficulty: "medium",
    description: "Late 30s tech professional, progressive-leaning",
    age: "Late 30s",
    location: "Manhattan",
    occupation: "Tech/Finance Professional",
    income: "High income, high rent",
    votingHistory: "Engaged voter, progressive values",
    keyIssues: [
      "Rent and housing affordability",
      "Public transit improvements",
      "Climate change action",
      "Inclusive city policies",
    ],
    skepticism:
      "Thinks you're out of touch, maybe too 'old school' or conservative; doubts you'll support progressive values",
    personality:
      "Informed and questioning. Will push back on traditional politics. Wants specifics on progressive policies.",
    vapiAssistantId: "YOUR_ASSISTANT_ID_HERE", // TODO: Replace with actual Vapi assistant ID
  },
  {
    id: "medium-2",
    name: "New Immigrant Family - Brooklyn/Queens",
    difficulty: "medium",
    description: "Early 30s first-generation immigrant, working multiple jobs",
    age: "Early 30s",
    location: "Brooklyn/Queens",
    occupation: "Multiple jobs",
    income: "Working class",
    votingHistory: "Newer voter, hopeful but cautious",
    keyIssues: [
      "Public school quality",
      "Neighborhood safety",
      "Affordable housing",
      "Language and cultural accessibility",
    ],
    skepticism:
      "Feels politics ignore immigrant communities, may not trust established politicians, may feel you're not truly representing them",
    personality:
      "Hopeful but guarded. Needs to feel heard and understood. Cultural sensitivity is crucial. Family-focused.",
      vapiAssistantId: "f2fb61a9-222a-4679-be26-4a71111fb306",
  },

  // HARD PROFILES
  {
    id: "hard-1",
    name: "Disillusioned Former Democrat - Bronx",
    difficulty: "hard",
    description: "Mid-50s lifelong voter feeling abandoned by the system",
    age: "Mid-50s",
    location: "The Bronx",
    occupation: "Various jobs over the years",
    income: "Low to moderate",
    votingHistory: "Longtime Democrat, now considering not voting",
    keyIssues: [
      "Broken promises",
      "Housing still unaffordable",
      "Crime remains high",
      "Weak city services",
    ],
    skepticism:
      "Thinks you're 'just another politician', 'the same old talk', maybe worse. Might say: 'Why vote? Nothing's changed.'",
    personality:
      "Angry, frustrated, cynical. Will challenge everything you say. Needs to be convinced you're genuinely different.",
      vapiAssistantId: "9dcea913-5345-4f4f-93b4-e0794c675f2d",
  },
  {
    id: "hard-2",
    name: "Independent Conservative - Staten Island",
    difficulty: "hard",
    description: "Late 60s traditional values voter, skeptical of city agenda",
    age: "Late 60s",
    location: "Staten Island / Outer Boroughs",
    occupation: "Retired or semi-retired",
    income: "Moderate",
    votingHistory: "Independent or conservative, may lean Republican",
    keyIssues: [
      "Crime and 'law & order'",
      "Property taxes",
      "Uncontrolled development",
      "Over-regulation",
      "City catering to 'others'",
    ],
    skepticism:
      "Seems you're too liberal, too city-elite, may distrust government intrusiveness, may lean Republican or non-voting",
    personality:
      "Firm in beliefs, traditional values. Will be polite but unmovable unless you address their concerns directly. Skeptical of progressive policies.",
    vapiAssistantId: "YOUR_ASSISTANT_ID_HERE", // TODO: Replace with actual Vapi assistant ID
  },

  {
    id: "hard-3",
    name: "Andrew Cuomo",
    difficulty: "hard",
    description: "Mayoral Candidate",
    age: "Late 60s",
    location: "Queens",
    occupation: "Retired or semi-retired",
    income: "Moderate",
    votingHistory: "Independent or conservative, may lean Republican",
    keyIssues: [
      "taxing the rich",
      "Property taxes",
      "immigration",
      "Over-regulation",
      "City catering to 'others'",
    ],
    skepticism:
      "Seems you're too liberal, too city-elite, may distrust government intrusiveness, may lean Republican or non-voting",
    personality:
      "Firm in beliefs, traditional values. Will be polite but unmovable unless you address their concerns directly. Skeptical of progressive policies.",
      vapiAssistantId: "cde00b8a-3ebf-4d4f-8587-7e8fec8e5fda",
  },

  {
    id: "hard-",
    name: "Bernie Sanders: Independent Candidate",
    difficulty: "hard",
    description: "Hates both left and right",
    age: "mid 80s",
    location: "Brooklyn",
    occupation: "Retired or semi-retired",
    income: "Moderate",
    votingHistory: "Independent or conservative, may lean Republican",
    keyIssues: [
      "current system doesn't tax the rich enough",
      "lower taxes",
      "Uncontrolled development",
      "socialism",
      "city is turning intolerant",
    ],
    skepticism:
      "Seems you're too liberal, too city-elite, may distrust government intrusiveness, may lean Republican or non-voting",
    personality:
      "Firm in beliefs, traditional values. Will be polite but unmovable unless you address their concerns directly. Skeptical of progressive policies.",
      vapiAssistantId: "d39d6278-399a-4abc-9540-6de073282a29",
  },

];

export function getProfilesByDifficulty(difficulty: "easy" | "medium" | "hard") {
  return voterProfiles.filter((profile) => profile.difficulty === difficulty);
}

export function getProfileById(id: string) {
  return voterProfiles.find((profile) => profile.id === id);
}

