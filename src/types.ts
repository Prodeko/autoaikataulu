export interface Event {
  name: string;
  date: Date;
}

export interface WeekEvents {
  events: Event[];
  week: number;
}
