import { Module } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Stream } from 'src/stream/entities/stream.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Semester,Stream])
  ],
  controllers: [SemesterController],
  providers: [SemesterService],
})
export class SemesterModule {}
