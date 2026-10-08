import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account])
  ],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
