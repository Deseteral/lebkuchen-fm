import { Service } from 'typedi';
import { JsonController, Get, Authorized, QueryParam } from 'routing-controllers';
import { HistoryService } from '@service/domain/history/history-service';
import { HistoryResponseDto } from '@service/api/history/model/history-response-dto';
import { HistorySummaryResponseDto } from '@service/api/history/model/history-summary-response-dto';
import { HistorySummaryService } from '@service/domain/history/history-summary-service';

@Service()
@JsonController('/api/history')
@Authorized()
class HistoryController {
  constructor(
    private historyService: HistoryService,
    private historySummaryService: HistorySummaryService,
  ) { }

  @Get('/')
  async getHistoryEntries(): Promise<HistoryResponseDto> {
    const entries = await this.historyService.getAll();
    return { entries };
  }

  @Get('/summary')
  async getHistorySummary(
    @QueryParam('from', { required: true }) from: string,
    @QueryParam('to', { required: true }) to: string,
    @QueryParam('most_popular_songs_limit') mostPopularSongsLimit?: number,
  ): Promise<HistorySummaryResponseDto> {
    const summary = await this.historySummaryService.generateSummary(from, to, mostPopularSongsLimit);
    return { summary };
  }
}

export { HistoryController };
