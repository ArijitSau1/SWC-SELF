
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUniversityDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(150)
  name: string;
}
