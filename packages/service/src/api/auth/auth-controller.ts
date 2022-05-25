import { Service } from 'typedi';
import { Post, Body, JsonController, UnauthorizedError, Session, Authorized, Get, OnUndefined } from 'routing-controllers';
import { AuthRequestDto } from '@service/lib';
import { RequestSession } from '@service/api/request-session';
import { LoggedInResponseDto } from '@service/api/auth/model/logged-in-response-dto';
import { Session as ExpressSession } from 'express-session';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '@service/domain/auth/auth-service';

@Service()
@JsonController('/auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  @Authorized()
  async getLoggedIn(@Session() session: RequestSession): Promise<LoggedInResponseDto> {
    if (!session.loggedUserName) {
      throw new UnauthorizedError('Unauthorized user');
    }

    return { username: session.loggedUserName };
  }

  @Post('/')
  @OnUndefined(StatusCodes.OK)
  async auth(@Body() authData: AuthRequestDto, @Session() session: RequestSession): Promise<void> {
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

export { AuthController };
