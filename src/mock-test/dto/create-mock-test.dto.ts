
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { PaidOrFree } from 'src/enum';

export class CreateMockTestDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  total_questions?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  total_marks: number;

  @IsEnum(PaidOrFree)
  access_type: PaidOrFree;

  @IsOptional()
  @IsInt()
  @Min(0)
  price: number;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;
}
