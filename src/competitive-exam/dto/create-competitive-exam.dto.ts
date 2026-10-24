import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCompetitiveExamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
