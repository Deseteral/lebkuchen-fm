interface AppNotification {
  id: string;
  key?: string;
  title: string;
  message: string;
  timestamp: number;
  sticky?: boolean;
}

export type { AppNotification };
