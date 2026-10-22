import { Controller } from '@nestjs/common';
import { StudentAnswerService } from './student-answer.service';

@Controller('student-answer')
export class StudentAnswerController {
  constructor(private readonly studentAnswerService: StudentAnswerService) {}
}
