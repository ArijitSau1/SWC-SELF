import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  MaxLength,
  Max,
} from 'class-validator';

import { PaidOrFree } from 'src/enum';

export class CreateAudioLactureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;


  @IsNumber()
  @Min(0)
  duration: number;



  @IsEnum(PaidOrFree)
  access_type: PaidOrFree;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;
}