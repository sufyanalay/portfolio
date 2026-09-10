export interface Service {
  _id: string;
  label: string;
  order: number;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  current: boolean;
}

export interface JourneyStat {
  value: string;
  label: string;
}

export interface Journey {
  _id: string;
  heading: string;
  milestones: Milestone[];
  stats: JourneyStat[];
}