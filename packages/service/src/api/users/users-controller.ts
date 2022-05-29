import { Service } from 'typedi';
import { JsonController, Get, Authorized, Post, Body, OnUndefined } from 'routing-controllers';
import { UsersService } from '@service/domain/users/users-service';
import { UsersResponseDto } from '@service/api/users/model/users-response-dto';
import { AddUserRequestDto } from '@service/api/users/model/add-user-request-dto';
import { StatusCodes } from 'http-status-codes';

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
  @OnUndefined(StatusCodes.CREATED)
  async addUser(@Body() addUserRequest: AddUserRequestDto): Promise<void> {
    await this.usersService.addNewUser(addUserRequest.username);
  }
}

export { UsersController };
