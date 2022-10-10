import { UserData } from '@service/domain/users/user';

export interface UsersResponseDto {
  users: UserData[],
}
