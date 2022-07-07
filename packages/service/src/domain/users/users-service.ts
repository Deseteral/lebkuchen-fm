import { Service } from 'typedi';
import { UsersRepository } from '@service/domain/users/users-repository';
import { User, UserData } from '@service/domain/users/user';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { Logger } from '@service/infrastructure/logger';

@Service()
class UsersService {
  private static logger = new Logger('users-service');

  constructor(private repository: UsersRepository) { }

  async getAllUserData(): Promise<UserData[]> {
    return (await this.repository.findAllOrderByNameDesc())
      .map((user) => user.data);
  }

  async getByName(name: string): Promise<User | null> {
    return this.repository.findByName(name);
  }

  async getByApiToken(apiToken: string): Promise<User | null> {
    return this.repository.findByApiToken(apiToken);
  }

  async doesUserExist(name: string): Promise<boolean> {
    const user = await this.getByName(name);
    return (user !== null);
  }

  async addNewUser(name: string): Promise<void> {
    const exists = await this.doesUserExist(name);
    if (exists) {
      throw new Error(`User "${name}" already exists`);
    }

    const dateNow = new Date();
    const user: User = {
      data: {
        name,
        discordId: null,
        creationDate: dateNow,
        lastLoggedIn: dateNow,
      },
      secret: null,
    };

    await this.repository.insert(user);

    UsersService.logger.info(`Created new user "${user.data.name}"`);
  }

  async setPassword(password: string, user: User): Promise<User> {
    const salt = nanoid(64);
    const hashedPassword = await UsersService.hashPassword(password, salt);
    const apiToken = nanoid(32);

    const newUser: User = {
      ...user,
      secret: {
        hashedPassword,
        salt,
        apiToken,
      },
    };

    await this.repository.replace(newUser);
    return newUser;
  }

  async connectWithDiscordAccount(user: User, discordId: string): Promise<void> {
    if (user.data.discordId) return;

    const newUser: User = {
      ...user,
      data: {
        ...user.data,
        discordId,
      },
    };

    await this.repository.replace(newUser);
  }

  async hasConnectedDiscordAccount(discordId: string): Promise<boolean> {
    const user: (User | null) = await this.repository.findByDiscordId(discordId);
    return !!user;
  }

  async updateLastLoginDate(user: User): Promise<void> {
    const updatedUser: User = {
      ...user,
      data: {
        ...user.data,
        lastLoggedIn: new Date(),
      },
    };

    await this.repository.replace(updatedUser);
  }

  static hashPassword(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const iterations = 50000;
      const keylen = 64;
      const digest = 'sha512';

      crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        if (err) {
          reject(err);
        } else {
          resolve(key.toString('hex'));
        }
      });
    });
  }

  static async checkPassword(password: string, user: User): Promise<boolean> {
    if (!user.secret) return false;

    const hashedRequestPassword = await UsersService.hashPassword(password, user.secret.salt);
    return hashedRequestPassword === user.secret.hashedPassword;
  }
}

export { UsersService };
