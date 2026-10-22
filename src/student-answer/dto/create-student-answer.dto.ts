
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateStudentAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  attemptId: string;

  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  selected_option: string;
}
