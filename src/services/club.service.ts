import { UserRole } from "../common/enums";
import { IClubAtr, IClubCreationAtr, IUserAtr } from "../common/interfaces";
import { ClubRepository } from "../repositories/club.repository";
import { UserRepository } from "../repositories/user.repository";
import { ObjectId } from "mongodb";

export class ClubService {
  constructor(
    private readonly repo: ClubRepository = new ClubRepository(),
    private readonly userRepo = new UserRepository()
  ) {}

  private cleanData(data: any): any {
    const cleaned = { ...data };

    if (cleaned.contact) {
      if (cleaned.contact.email === undefined) {
        delete cleaned.contact.email;
      }
    }

    return cleaned;
  }

  async list(): Promise<IClubAtr[]> {
    return this.repo.findAll({});
  }

  async getById(id: string): Promise<IClubAtr | null> {
    return this.repo.findOne({ _id: id });
  }

  async createOne(data: IClubCreationAtr, userId: ObjectId): Promise<IClubAtr> {
    const cleanedData = this.cleanData(data);
    const user: IUserAtr | null = await this.userRepo.findById(userId);
    if (user) {
      user.role = UserRole.Owner;
      await this.userRepo.updateOne({ _id: userId }, user);
    }
    const club = await this.repo.createOne({ ...cleanedData, owner: userId });
    return club;
  }

  async updateById(
    id: string,
    data: Partial<IClubAtr>
  ): Promise<IClubAtr | null> {
    const cleanedData = this.cleanData(data);
    return this.repo.updateOne({ _id: id }, cleanedData);
  }

  async deleteById(id: string): Promise<IClubAtr | null> {
    return this.repo.deleteOne({ _id: id });
  }
}
