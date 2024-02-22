import { Service } from 'typedi';
import { JsonController, Get, Authorized, Post, Body, CurrentUser, InternalServerError, OnUndefined, Param, QueryParam } from 'routing-controllers';
import { LLMPromptsService } from '@service/domain/llm-prompts/llm-prompts-service';
import { User } from '@service/domain/users/user';
import { Logger } from '@service/infrastructure/logger';
import { UpdateLLMPromptRequestDto } from '@service/api/llm-prompts/model/update-llm-prompt-request-dto';
import { WrongTypeError } from '@service/api/llm-prompts/model/wrong-type-error';
import { LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';
import { LLMPromptsResponseDto } from '@service/api/llm-prompts/model/llm-prompts-response-dto';
import { LLMPromptsInfoResponseDto } from '@service/api/llm-prompts/model/llm-prompts-info-response-dto';

@Service()
@JsonController('/api/llm-prompts')
@Authorized()
class LLMPromptsController {
  private static logger = new Logger('llm-prompts-controller');

  constructor(private llmPromptsService: LLMPromptsService) { }

  @Post('/')
  @OnUndefined(201)
  async updateLLMPrompt(@Body() body: UpdateLLMPromptRequestDto, @CurrentUser() user: User): Promise<void> {
    LLMPromptsController.logger.info(`Received prompt update for ${body.type} from ${user.data.name}`);

    this.validateTypeParam(body.type);

    const result = this.llmPromptsService.addNewPrompt(
      body.text,
      body.type as LLMPromptType,
      body.variant,
      body.deprecated,
      user,
    );

    if (!result) {
      throw new InternalServerError('Could not save prompt update');
    }
  }

  @Get('/info')
  async getInfo(): Promise<LLMPromptsInfoResponseDto> {
    throw new Error('Not implemented yet');
  }

  @Get('/:type/:variant')
  async getPrompts(
    @Param('type') type: string,
    @Param('variant') variant: string,
    @QueryParam('active') active: boolean,
  ): Promise<LLMPromptsResponseDto> {
    this.validateTypeParam(type);
    throw new Error('Not implemented yet');
  }

  private validateTypeParam(type: string): void {
    if (!Object.values(LLMPromptType).includes(type as LLMPromptType)) {
      throw new WrongTypeError(type);
    }
  }
}

export {
  LLMPromptsController,
};
