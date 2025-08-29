import { UserRepository } from "../repositories/user.repository";
import { IUserAtr, IUserSaveAtr } from "../common/interfaces";
import { NotFoundError } from "../common/errors";

export class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async findAllUsers() {
    return this.userRepository.findAll({});
  }

  async findUserById(id: string) {
    return this.userRepository.findById({ _id: id });
  }

  async updateUser(id: string, data: Partial<IUserSaveAtr>) {
    return this.userRepository.updateOne({ _id: id }, data);
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteOne({ _id: id });
  }
}
