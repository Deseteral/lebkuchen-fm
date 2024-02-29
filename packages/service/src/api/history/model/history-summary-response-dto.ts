import { HistorySummary, YearlyHistorySummary } from '@service/domain/history/history-summary';

export interface HistorySummaryResponseDto {
  summary: HistorySummary,
}

export interface HistorySummaryYearsResponseDto {
  years: YearlyHistorySummary[],
}
