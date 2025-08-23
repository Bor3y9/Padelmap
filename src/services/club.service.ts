import { IClubAtr, IClubCreationAtr } from "../common/interfaces";
import { ClubRepository } from "../repositories/club.repository";
// import { taskValidation } from "../common/validation";

export class ClubService {
  constructor(private readonly repo: ClubRepository = new ClubRepository()) {}

  private cleanData(data: any): any {
    const cleaned = { ...data };

    // Remove undefined values from nested objects
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

  async createOne(data: IClubCreationAtr): Promise<IClubAtr> {
    const cleanedData = this.cleanData(data);
    return this.repo.createOne(cleanedData);
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
