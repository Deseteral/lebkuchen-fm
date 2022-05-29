import { Service } from 'typedi';
import { JsonController, Get, Authorized } from 'routing-controllers';
import { HistoryService } from '@service/domain/history/history-service';
import { HistoryResponseDto } from '@service/api/history/model/history-response-dto';

@Service()
@JsonController('/history')
@Authorized()
class HistoryController {
  constructor(private historyService: HistoryService) { }

  @Get('/')
  async getHistoryEntries(): Promise<HistoryResponseDto> {
    const entries = await this.historyService.getAll();
    return { entries };
  }
}

export { HistoryController };
