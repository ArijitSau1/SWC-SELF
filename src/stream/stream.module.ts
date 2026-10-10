import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stream } from './entities/stream.entity';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { Semester } from 'src/semester/entities/semester.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([Stream,SchoolClass,Semester])
  ],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
