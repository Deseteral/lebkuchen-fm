import { HttpError } from 'routing-controllers';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@service/api/error-response';

class InternalServerError extends HttpError {
  private errorMessage: string;

  constructor(error: Error) {
    super(StatusCodes.INTERNAL_SERVER_ERROR);
    this.errorMessage = error.message;
  }

  toJSON(): ErrorResponse {
    return {
      description: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: { message: this.errorMessage },
    };
  }
}

export { InternalServerError };
