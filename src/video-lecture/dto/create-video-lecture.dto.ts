
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
  MinLength,
  Max,
} from 'class-validator';

import { PaidOrFree } from 'src/enum';

export class CreateVideoLactureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;


  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  video_url: string;

  
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
