
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDegreeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  name: string;
}
