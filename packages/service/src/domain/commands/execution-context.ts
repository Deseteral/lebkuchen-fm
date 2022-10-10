import { User } from '@service/domain/users/user';

export interface ExecutionContext {
  discordId: (string | null),
  user: User,
}
