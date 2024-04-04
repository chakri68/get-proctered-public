export const FLAG_CODES = ["GP-001", "GP-002", "GP-003", "GP-004"] as const;

export type FlagCode = (typeof FLAG_CODES)[number];

export const FLAG_LABELS: { [x in FlagCode]: string } = {
  "GP-001": "Test Event 1",
  "GP-002": "Test Event 2",
  "GP-003": "Test Event 3",
  "GP-004": "Test Event 4",
};

export type Flag = {
  id: string;
  code: FlagCode;
  timestamp: number;
  data: any;
};
