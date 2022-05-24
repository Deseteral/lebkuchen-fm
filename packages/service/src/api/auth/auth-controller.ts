import { Service } from 'typedi';
import { Post, Body, JsonController, UnauthorizedError, Session, Authorized, Get } from 'routing-controllers';
import { Logger } from '@service/infrastructure/logger';
import { AuthRequestDto } from '@service/lib';
import { UsersService } from '@service/domain/users/users-service';
import { RequestSession } from '@service/api/request-session';
import { LoggedInResponseDto } from '@service/api/auth/model/logged-in-response-dto';

@Service()
@JsonController('/auth')
class AuthController {
  private static logger = new Logger('auth-controller');

  constructor(private usersService: UsersService) { }

  @Get('/')
  @Authorized()
  async getLoggedIn(@Session() session: RequestSession): Promise<LoggedInResponseDto> {
    if (!session.loggedUserName) {
      throw new UnauthorizedError('Unauthorized user');
    }

    return {
      username: session.loggedUserName,
    };
  }

  @Post('/')
  async auth(@Body() authData: AuthRequestDto, @Session() session: RequestSession): Promise<string> {
    const { username, password } = authData;
    const user = await this.usersService.getByName(username);

    if (!user) {
      AuthController.logger.info(`User "${username}" tried to log in, but does not exist`);
      throw new UnauthorizedError('User does not exist');
    }

    const authorizeUser = (): void => {
      session.loggedUserName = user.name; // eslint-disable-line no-param-reassign
    };

    // TODO: Extract this logic into auth service

    if (user.password) {
      if (await UsersService.checkPassword(password, user)) {
        authorizeUser();
        AuthController.logger.info(`User "${username}" logged in`);
      } else {
        AuthController.logger.info(`User "${username}" tried to log in, but provided wrong password`);
        throw new UnauthorizedError('Incorrect password');
      }
    } else {
      await this.usersService.setPassword(password, user);
      authorizeUser();
      AuthController.logger.info(`User "${username}" set new password`);
    }

    return 'ok'; // TODO: This makes no sense
  }
}

export { AuthController };
