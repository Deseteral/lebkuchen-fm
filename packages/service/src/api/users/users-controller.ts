import { Service } from 'typedi';
import { JsonController, Get, Authorized } from 'routing-controllers';
import { UsersService } from '@service/domain/users/users-service';
import { UsersResponseDto } from '@service/api/users/model/users-response-dto';

@Service()
@JsonController('/users')
@Authorized()
class UsersController {
  constructor(private usersService: UsersService) { }

  @Get('/')
  async getUsers(): Promise<UsersResponseDto> {
    const users = await this.usersService.getAllUserData();
    return { users };
  }
}

export { UsersController };
