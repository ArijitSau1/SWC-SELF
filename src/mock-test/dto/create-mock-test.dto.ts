
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaidOrFree } from 'src/enum';

export class CreateMockTestDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  class_name: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  semester_name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  total_questions: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration: number;

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
