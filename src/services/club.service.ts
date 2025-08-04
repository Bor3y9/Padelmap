import { IClubAtr, IClubCreationAtr } from "../common/interfaces";
import { ClubRepository } from "../repositories/club.repository";
// import { taskValidation } from "../common/validation";

export class ClubService {
  constructor(private readonly repo: ClubRepository = new ClubRepository()) {}

  async list(): Promise<IClubAtr[]> {
    return this.repo.findAll({});
  }

  async getById(id: string): Promise<IClubAtr | null> {
    return this.repo.findOne({ _id: id });
  }

  async createOne(data: IClubCreationAtr): Promise<IClubAtr> {
    return this.repo.createOne(data);
  }

  async updateById(
    id: string,
    data: Partial<IClubAtr>
  ): Promise<IClubAtr | null> {
    return this.repo.updateOne({ _id: id }, data);
  }

  async deleteById(id: string): Promise<IClubAtr | null> {
    return this.repo.deleteOne({ _id: id });
  }
}
