import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { DefaultStatus } from 'src/enum';


export class CreateStreamDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsUUID()
  @IsNotEmpty()
  schoolClassId: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}