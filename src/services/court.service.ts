import { ICourtAtr, ICourtCreationAtr } from "../common/interfaces";
import { CourtRepository } from "../repositories/court.repository";

export class CourtService {
  constructor(private readonly repo: CourtRepository = new CourtRepository()) {}

  async list(): Promise<ICourtAtr[]> {
    return this.repo.findAll({});
  }

  async getById(id: string): Promise<ICourtAtr | null> {
    return this.repo.findOne({ _id: id });
  }

  async createOne(data: ICourtCreationAtr): Promise<ICourtAtr> {
    return this.repo.createOne(data);
  }

  async updateById(
    id: string,
    data: Partial<ICourtAtr>
  ): Promise<ICourtAtr | null> {
    return this.repo.updateOne({ _id: id }, data);
  }

  async deleteById(id: string): Promise<ICourtAtr | null> {
    return this.repo.deleteOne({ _id: id });
  }
}
