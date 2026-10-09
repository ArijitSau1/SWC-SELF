import {
  IsNotEmpty,
  IsString,
  IsIn,
  MaxLength,
  IsEnum,
} from 'class-validator';


export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

}