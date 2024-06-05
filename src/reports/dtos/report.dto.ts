import { Expose, Transform } from "class-transformer";
import { User } from "src/users/user.entity";

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  // Take the original report entity, look up user
  // and assing its id to userId
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}