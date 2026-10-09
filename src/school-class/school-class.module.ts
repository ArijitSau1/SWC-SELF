import { Module } from '@nestjs/common';
import { SchoolClassService } from './school-class.service';
import { SchoolClassController } from './school-class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from './entities/school-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolClass])],
  controllers: [SchoolClassController],
  providers: [SchoolClassService],
})
export class SchoolClassModule {}
