import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  question: string;

  @IsArray()
  @MinLength(2)
  @MaxLength(5)
  @IsString()
  options: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  correct_option: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  explanation: string;

  @IsUUID()
  @IsNotEmpty()
  mockTestId: string;
}
