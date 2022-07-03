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
    const userExists = await this.usersService.doesUserExist(username);

    if (!userExists) {
      const userCount = (await this.usersService.getAllUserData()).length;

      if (userCount === 0) {
        await this.usersService.addNewUser(username);
      } else {
        AuthService.logger.info(`User "${username}" tried to log in, but does not exist`);
        throw new Error('User does not exist');
      }
    }

    const user = await this.usersService.getByName(username);
    if (!user) throw new Error('Something went wrong');

    const userDidSetPassword: boolean = (!!user.secret);

    if (userDidSetPassword) {
      const isPasswordCorrect = await UsersService.checkPassword(password, user);
      if (isPasswordCorrect) {
        await this.loginCorrectPassword(user, session);
      } else {
        this.loginWrongPassword(user);
      }
    } else {
      await this.loginPasswordNotSet(user, password, session);
    }
  }

  async isRequestAuthorized(session: RequestSession, token: (string | null)): Promise<boolean> {
    const isSessionAuthorized: boolean = await this.isSessionAuthorized(session);
    const isApiTokenAuthorized: boolean = token
      ? await this.isApiTokenAuthorized(token)
      : false;

    return (isSessionAuthorized || isApiTokenAuthorized);
  }

  async getRequestsUser(session: RequestSession, token: (string | null)): Promise<User| null> {
    const userFromSession = await this.getUserFromSession(session);
    const userFromToken = token ? await this.usersService.getByApiToken(token) : null;
    return userFromSession || userFromToken;
  }

  async isWebSocketAuthorized(session: RequestSession): Promise<boolean> {
    return this.isSessionAuthorized(session);
  }

  private async getUserFromSession(session: RequestSession): Promise<User | null> {
    return session.loggedUser
      ? this.usersService.getByName(session.loggedUser.name)
      : null;
  }

  private async isSessionAuthorized(requestSession: RequestSession): Promise<boolean> {
    const user = await this.getUserFromSession(requestSession);
    return (user !== null);
  }

  private async isApiTokenAuthorized(token: string): Promise<boolean> {
    const user = await this.usersService.getByApiToken(token);
    return (user !== null);
  }

  private async loginCorrectPassword(user: User, session: RequestSession): Promise<void> {
    // Authorize session
    session.loggedUser = { // eslint-disable-line no-param-reassign
      name: user.data.name,
      apiToken: user.secret!.apiToken,
    };

    await this.usersService.updateLastLoginDate(user);

    AuthService.logger.info(`User "${user.data.name}" logged in`);
  }

  private loginWrongPassword(user: User): void {
    AuthService.logger.info(`User "${user.data.name}" tried to log in, but provided wrong password`);
    throw new Error('Incorrect password');
  }

  private async loginPasswordNotSet(user: User, nextPassword: string, session: RequestSession): Promise<void> {
    const userWithPassword = await this.usersService.setPassword(nextPassword, user);
    AuthService.logger.info(`User "${user.data.name}" set new password`);

    await this.loginCorrectPassword(userWithPassword, session);
  }
}

export { AuthService };
