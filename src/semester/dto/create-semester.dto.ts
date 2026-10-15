import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DefaultStatus } from '../../enum';

export class CreateSemesterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(100)
  name: string;

  @IsUUID()
  streamId: string;

  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}