import { Service } from 'typedi';
import { Post, Body, JsonController, UnauthorizedError, Session, Req } from 'routing-controllers';
import Logger from '@service/infrastructure/logger';
import { AuthRequestDto } from '@service/lib';
import UsersService from '@service/domain/users/users-service';

@Service()
@JsonController('/auth')
class AuthController {
  private static logger = new Logger('auth-controller');

  constructor(private usersService: UsersService) { }

  @Post('/')
  async auth(@Body() authData: AuthRequestDto, @Req() req: any): Promise<void> {
    const { username, password } = authData;
    console.log(req.session);

    const user = await this.usersService.getByName(username);

    if (!user) {
      throw new UnauthorizedError('User does not exist');
    }

    if (user.password) {
      if (await UsersService.checkPassword(password, user)) {
        // set cookie
      } else {
        throw new UnauthorizedError('Incorrect password');
      }
    } else {
      await this.usersService.setPassword(password, user);
      // set cookie
    }
  }
}

export default AuthController;
