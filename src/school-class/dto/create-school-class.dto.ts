import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ClassTierEnum, DefaultStatus } from 'src/enum';


export class CreateSchoolClassDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(ClassTierEnum)
  tier: ClassTierEnum;

  @IsNotEmpty()
  @IsUUID()
  boardId: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
