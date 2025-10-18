export type ThemeMode = 'dark' | 'light' | 'auto';

export interface TimeGlidePalette {
  background: string;
  text: string;
  accent: string;
  track: string;
  thumb: string;
}

export interface TimeGlideOptions {
  container: string | Element;
  startDate?: Date | string | number;
  endDate?: Date | string | number;
  startYear?: number;
  endYear?: number;
  defaultDate?: Date | string | number;
  showTodayMarker?: boolean;
  enableKeyboard?: boolean;
  accelerationDelay?: number;
  shadow?: boolean;
  theme?: ThemeMode;
  palette?: Partial<TimeGlidePalette>;
  onChange?: (date: Date) => void;
}

export default class TimeGlide {
  constructor(options: TimeGlideOptions);
  getDate(): Date;
  setDate(date: Date | string | number): void;
  setTheme(theme: ThemeMode, palette?: Partial<TimeGlidePalette>): void;
  getTheme(): ThemeMode;
  destroy(): void;
}

