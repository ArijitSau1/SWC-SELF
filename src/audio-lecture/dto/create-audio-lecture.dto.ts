
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


  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  audio_url: string;

  
  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;


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