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
        this.correctPassword(user, session);
      } else {
        this.wrongPassword(user);
      }
    } else {
      this.passwordNotSet(user, password, session);
    }
  }

  private correctPassword(user: User, session: RequestSession): void {
    // Authorize session
    session.loggedUserName = user.name; // eslint-disable-line no-param-reassign

    AuthService.logger.info(`User "${user.name}" logged in`);
  }

  private wrongPassword(user: User): void {
    AuthService.logger.info(`User "${user.name}" tried to log in, but provided wrong password`);
    throw new Error('Incorrect password');
  }

  private async passwordNotSet(user: User, nextPassword: string, session: RequestSession): Promise<void> {
    await this.usersService.setPassword(nextPassword, user);
    AuthService.logger.info(`User "${user.name}" set new password`);

    this.correctPassword(user, session);
  }
}

export { AuthService };
