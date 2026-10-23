import { Controller } from '@nestjs/common';
import { CompetitiveExamService } from './competitive-exam.service';

@Controller('competitive-exam')
export class CompetitiveExamController {
  constructor(private readonly competitiveExamService: CompetitiveExamService) {}
}
