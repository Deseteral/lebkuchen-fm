import { Service } from 'typedi';
import { JsonController, Get, Authorized, QueryParam } from 'routing-controllers';
import { HistoryService } from '@service/domain/history/history-service';
import { HistoryResponseDto } from '@service/api/history/model/history-response-dto';
import { HistorySummaryResponseDto } from '@service/api/history/model/history-summary-response-dto';

@Service()
@JsonController('/api/history')
@Authorized()
class HistoryController {
  constructor(private historyService: HistoryService) { }

  @Get('/')
  async getHistoryEntries(): Promise<HistoryResponseDto> {
    const entries = await this.historyService.getAll();
    return { entries };
  }

  @Get('/summary')
  async getHistorySummary(
    @QueryParam('from', { required: true }) from: string,
    @QueryParam('to', { required: true }) to: string,
  ): Promise<HistorySummaryResponseDto> {
    const summary = await this.historyService.generateSummary(from, to);
    return { summary };
  }
}

export { HistoryController };
