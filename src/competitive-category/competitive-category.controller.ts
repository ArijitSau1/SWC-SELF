import { Controller } from '@nestjs/common';
import { CompetitiveCategoryService } from './competitive-category.service';

@Controller('competitive-category')
export class CompetitiveCategoryController {
  constructor(private readonly competitiveCategoryService: CompetitiveCategoryService) {}
}
