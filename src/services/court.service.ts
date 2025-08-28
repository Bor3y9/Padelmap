import { ICourtAtr, ICourtCreationAtr } from "../common/interfaces";
import { CourtRepository } from "../repositories/court.repository";
import { ClubRepository } from "../repositories/club.repository";

export class CourtService {
  constructor(
    private readonly repo: CourtRepository = new CourtRepository(),
    private readonly clubRepo: ClubRepository = new ClubRepository()
  ) {}

  async list(): Promise<ICourtAtr[]> {
    return this.repo.findAll({});
  }

  async getById(id: string): Promise<ICourtAtr | null> {
    return this.repo.findOne({ _id: id });
  }

  async createOne(data: ICourtCreationAtr): Promise<ICourtAtr> {
    const clubExists = await this.clubRepo.findOne({ _id: data.club });
    if (!clubExists) {
      const error = new Error("Club not found");
      (error as any).statusCode = 404;
      (error as any).field = "club";
      throw error;
    }

    return this.repo.createOne(data);
  }

  async updateById(
    id: string,
    data: Partial<ICourtAtr>
  ): Promise<ICourtAtr | null> {
    if (data.club) {
      const clubExists = await this.clubRepo.findOne({ _id: data.club });
      if (!clubExists) {
        const error = new Error("Club not found");
        (error as any).statusCode = 404;
        (error as any).field = "club";
        throw error;
      }
    }

    return this.repo.updateOne({ _id: id }, data);
  }

  async deleteById(id: string): Promise<ICourtAtr | null> {
    return this.repo.deleteOne({ _id: id });
  }
}
