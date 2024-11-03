import { Service } from 'typedi';
import { Post, Body, JsonController, UnauthorizedError, Session, Authorized, Get, OnUndefined, UseBefore } from 'routing-controllers';
import { RequestSession } from '@service/api/request-session';
import { LoggedInResponseDto } from '@service/api/auth/model/logged-in-response-dto';
import { Session as ExpressSession } from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '@service/domain/auth/auth-service';
import bodyParser from 'body-parser';

@Service()
@JsonController('/api/auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  @Authorized()
  async getLoggedInStatus(@Session() session: RequestSession): Promise<LoggedInResponseDto> {
    if (!session.loggedUser) {
      throw new UnauthorizedError('Unauthorized user');
    }

    return {
      username: session.loggedUser.name,
      apiToken: session.loggedUser.apiToken,
    };
  }

  @Post('/')
  @OnUndefined(StatusCodes.OK)
  @UseBefore(bodyParser.urlencoded())
  async auth(@Body() authData: AuthForm, @Session() session: RequestSession): Promise<void> {
    const { username, password } = authData;

    try {
      await this.authService.authorize(username, password, session);
    } catch (err) {
      throw new UnauthorizedError((err as Error).message);
    }
  }

  @Post('/logout')
  @Authorized()
  @OnUndefined(StatusCodes.OK)
  async logout(@Session() session: ExpressSession): Promise<void> {
    return new Promise((resolve) => {
      session.destroy(() => resolve());
    });
  }
}

interface AuthForm {
  username: string;
  password: string;
}

export { AuthController };
