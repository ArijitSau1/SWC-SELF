import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TestAttemptService } from './test-attempt.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';

@Controller('test-attempt')
export class TestAttemptController {
  constructor(private readonly testAttemptService: TestAttemptService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(
    @Query() query: DefaultStatusPaginationDto,
    @CurrentUser() user: Account,
  ) {
    return this.testAttemptService.findAll(query, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testAttemptService.findOne(id);
  }
}
