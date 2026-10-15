import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsUUID()
  schoolClassId?: string;

  @IsOptional()
  @IsUUID()
  semesterId?: string;
}