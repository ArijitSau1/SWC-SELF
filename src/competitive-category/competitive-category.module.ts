import { Module } from '@nestjs/common';
import { CompetitiveCategoryService } from './competitive-category.service';
import { CompetitiveCategoryController } from './competitive-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitiveCategory } from './entities/competitive-category.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CompetitiveCategory])
  ],
  controllers: [CompetitiveCategoryController],
  providers: [CompetitiveCategoryService],
})
export class CompetitiveCategoryModule {}
