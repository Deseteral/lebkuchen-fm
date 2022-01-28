import { HistoryEntry } from '@service/domain/history/history-entry';

export interface HistoryResponseDto {
  entries: HistoryEntry[],
}
