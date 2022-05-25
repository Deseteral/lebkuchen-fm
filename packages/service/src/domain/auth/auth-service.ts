import { RequestSession } from '@service/api/request-session';
import { User } from '@service/domain/users/user';
import { UsersService } from '@service/domain/users/users-service';
import { Logger } from '@service/infrastructure/logger';
import { Service } from 'typedi';

@Service()
class AuthService {
  private static logger = new Logger('auth-service');

  constructor(private usersService: UsersService) {}

  async authorize(username: string, password: string, session: RequestSession): Promise<void> {
    const user = await this.usersService.getByName(username);

    if (!user) {
      AuthService.logger.info(`User "${username}" tried to log in, but does not exist`);
      throw new Error('User does not exist');
    }

    const userDidSetPassword: boolean = !!user.password;

    if (userDidSetPassword) {
      const isPasswordCorrect = await UsersService.checkPassword(password, user);
      if (isPasswordCorrect) {
        this.loginCorrectPassword(user, session);
      } else {
        this.loginWrongPassword(user);
      }
    } else {
      this.loginPasswordNotSet(user, password, session);
    }
  }

  async isRequestAuthorized(session: RequestSession, token: (string | null)): Promise<boolean> {
    const isSessionAuthorized: boolean = await this.isSessionAuthorized(session);
    const isApiTokenAuthorized: boolean = token
      ? await this.isApiTokenAuthorized(token)
      : false;

    return (isSessionAuthorized || isApiTokenAuthorized);
  }

  async isWebSocketAuthorized(session: RequestSession): Promise<boolean> {
    return this.isSessionAuthorized(session);
  }

  private async isSessionAuthorized(requestSession: RequestSession): Promise<boolean> {
    if (!requestSession.loggedUserName) {
      return false;
    }

    const user = await this.usersService.getByName(requestSession.loggedUserName);
    return (user !== null);
  }

  private async isApiTokenAuthorized(token: string): Promise<boolean> {
    const user = await this.usersService.getByApiToken(token);
    return (user !== null);
  }

  private loginCorrectPassword(user: User, session: RequestSession): void {
    // Authorize session
    session.loggedUserName = user.name; // eslint-disable-line no-param-reassign

    AuthService.logger.info(`User "${user.name}" logged in`);
  }

  private loginWrongPassword(user: User): void {
    AuthService.logger.info(`User "${user.name}" tried to log in, but provided wrong password`);
    throw new Error('Incorrect password');
  }

  private async loginPasswordNotSet(user: User, nextPassword: string, session: RequestSession): Promise<void> {
    await this.usersService.setPassword(nextPassword, user);
    AuthService.logger.info(`User "${user.name}" set new password`);

    this.loginCorrectPassword(user, session);
  }
}

export { AuthService };
