import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDegreeUniversityDto {
  @IsUUID()
  @IsNotEmpty()
  degreeId: string;

  @IsUUID()
  @IsNotEmpty()
  universityId: string;
}
