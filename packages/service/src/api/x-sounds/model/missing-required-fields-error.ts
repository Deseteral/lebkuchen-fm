import { HttpError } from 'routing-controllers';
import { StatusCodes } from 'http-status-codes';

class MissingRequriedFieldsError extends HttpError {
  constructor() {
    super(StatusCodes.UNPROCESSABLE_ENTITY, 'Required fields are missing from the request');
  }
}

export { MissingRequriedFieldsError };
