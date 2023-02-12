export interface habit {
  name: string;
  color: string;
  createdAt: null | string;
  dates: {
    [key: string]: 1 | 2
  };
  archived: boolean;
  activeDays: boolean[]
}

export interface habits {
  [key: string]: habit
}