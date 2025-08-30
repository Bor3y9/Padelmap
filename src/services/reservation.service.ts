import { IReservationAtr, IReservationCreationAtr } from "../common/interfaces";
import { ReservationRepository } from "../repositories/reservation.repository";
import { ObjectId } from "mongodb";
import { ValidationError } from "../common/errors";

export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository = new ReservationRepository()
  ) {}

  async list(): Promise<IReservationAtr[]> {
    return this.reservationRepository.findAll({});
  }

  async getById(id: string): Promise<IReservationAtr | null> {
    return this.reservationRepository.findById({ _id: id });
  }

  async createOne(data: IReservationCreationAtr): Promise<IReservationAtr> {
    // Check for time conflicts
    await this.checkTimeConflicts(
      data.court as any,
      data.startTime,
      data.endTime
    );

    return this.reservationRepository.createOne(data);
  }

  async updateById(
    data: Partial<IReservationAtr>,
    id: string
  ): Promise<IReservationAtr | null> {
    // If updating time or court, check for conflicts
    if (data.startTime || data.endTime || data.court) {
      const existingReservation = await this.getById(id);
      if (!existingReservation) {
        return null;
      }

      const courtId = data.court || existingReservation.court;
      const startTime = data.startTime || existingReservation.startTime;
      const endTime = data.endTime || existingReservation.endTime;

      await this.checkTimeConflicts(courtId as any, startTime, endTime, id);
    }

    return this.reservationRepository.updateOne({ _id: id }, data);
  }

  async deleteById(id: string): Promise<IReservationAtr | null> {
    return this.reservationRepository.deleteOne({ _id: id });
  }

  async getUserReservations(userId: ObjectId): Promise<IReservationAtr[]> {
    return this.reservationRepository.findAll({ user: userId });
  }

  async getCourtReservations(courtId: string): Promise<IReservationAtr[]> {
    return this.reservationRepository.findAll({ court: courtId });
  }

  async getCourtReservationsInRange(
    courtId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IReservationAtr[]> {
    return this.reservationRepository.findAll({
      court: courtId,
      startTime: { $gte: startDate, $lte: endDate },
    });
  }

  private async checkTimeConflicts(
    courtId: ObjectId | string,
    startTime: Date,
    endTime: Date,
    excludeReservationId?: string
  ): Promise<void> {
    const query: any = {
      court: courtId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    };

    // Exclude current reservation when updating
    if (excludeReservationId) {
      query._id = { $ne: excludeReservationId };
    }

    const conflictingReservations = await this.reservationRepository.findAll(
      query
    );

    if (conflictingReservations.length > 0) {
      throw new ValidationError("Time slot conflict", [
        {
          message:
            "The selected time slot conflicts with an existing reservation",
          field: "startTime",
        },
      ]);
    }
  }
}
