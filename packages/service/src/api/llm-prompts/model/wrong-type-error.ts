import { HttpError } from 'routing-controllers';
import { StatusCodes } from 'http-status-codes';

class WrongTypeError extends HttpError {
  constructor(type: string) {
    super(StatusCodes.UNPROCESSABLE_ENTITY, `Type ${type} does not exist`);
  }
}

export {
  WrongTypeError,
};
