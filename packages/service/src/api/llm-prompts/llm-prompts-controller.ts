import { Service } from 'typedi';
import { JsonController, Get, Authorized, Post, Body, CurrentUser, InternalServerError, OnUndefined } from 'routing-controllers';
import { LLMPromptsService } from '@service/domain/llm-prompts/llm-prompts-service';
import { User } from '@service/domain/users/user';
import { LLMPromptsResponseDto } from '@service/api/llm-prompts/model/llm-prompts-response-dto';
import { Logger } from '@service/infrastructure/logger';
import { UpdateLLMPromptRequestDto } from '@service/api/llm-prompts/model/update-llm-prompt-request-dto';
import { WrongTypeError } from '@service/api/llm-prompts/model/wrong-type-error';
import { LLMPromptType } from '@service/domain/llm-prompts/llm-prompts';

@Service()
@JsonController('/api/llm-prompts')
@Authorized()
class LLMPromptsController {
  private static logger = new Logger('llm-prompts-controller');

  constructor(private llmPromptsService: LLMPromptsService) { }

  @Get('/')
  async getPromtps(): Promise<LLMPromptsResponseDto> {
    const prompts = await this.llmPromptsService.getAllPrompts();
    return { prompts };
  }

  @Post('/')
  @OnUndefined(201)
  async updateLLMPrompt(@Body() body: UpdateLLMPromptRequestDto, @CurrentUser() user: User): Promise<void> {
    LLMPromptsController.logger.info(`Received prompt update for ${body.type} from ${user.data.name}`);

    if (!Object.values(LLMPromptType).includes(body.type as LLMPromptType)) {
      throw new WrongTypeError(body.type);
    }

    const result = this.llmPromptsService.addNewPrompt(
      body.text,
      body.type as LLMPromptType,
      body.variant,
      body.deprecated,
    );

    if (!result) {
      throw new InternalServerError('Could not save prompt update');
    }
  }
}

export {
  LLMPromptsController,
};
