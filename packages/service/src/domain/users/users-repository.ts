import { User } from '@service/domain/users/user';
import { Repository } from '@service/infrastructure/repository';
import { DatabaseClient } from '@service/infrastructure/storage';
import { Service } from 'typedi';

@Service()
class UsersRepository extends Repository<User> {
  private constructor(storage: DatabaseClient) {
    super('users', storage);
  }

  findAllOrderByNameDesc(): Promise<User[]> {
    return this.collection.find({}).sort({ 'data.name': -1 }).toArray();
  }

  findByName(name: string): Promise<User | null> {
    return this.collection.findOne({ 'data.name': name });
  }

  findByApiToken(apiToken: string): Promise<User | null> {
    return this.collection.findOne({ 'password.apiToken': apiToken });
  }

  async insert(user: User): Promise<void> {
    await this.collection.insertOne(user);
  }

  async replace(user: User): Promise<void> {
    await this.collection.replaceOne({ _id: user._id }, user);
  }
}

export { UsersRepository };
