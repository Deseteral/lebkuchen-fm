import { Service } from 'typedi';
import { JsonController, Get, Authorized, Post } from 'routing-controllers';
import { UsersService } from '@service/domain/users/users-service';
import { UsersResponseDto } from '@service/api/users/model/users-response-dto';
import { AddUserRequestDto } from '@service/api/users/model/add-user-request-dto';

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

  @Post('/')
  async addUser(addUserRequest: AddUserRequestDto): Promise<void> {
    await this.usersService.addNewUser(addUserRequest.username);
  }
}

export { UsersController };
