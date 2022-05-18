import { HttpError } from 'routing-controllers';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@service/api/error-response';

class MissingRequriedFieldsError extends HttpError {
  constructor() {
    super(StatusCodes.BAD_GATEWAY);
  }

  toJSON(): ErrorResponse {
    return {
      description: ReasonPhrases.BAD_REQUEST,
      error: { message: 'Missing required field' },
    };
  }
}

export { MissingRequriedFieldsError };
