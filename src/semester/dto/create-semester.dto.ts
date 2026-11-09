import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DefaultStatus } from 'src/enum';


export class CreateSemesterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsUUID()
  streamId: string;

  @IsOptional()
  @IsUUID()
  degreeUniversityId: string;

}