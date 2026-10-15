import { Module } from '@nestjs/common';
import { DegreeUniversityService } from './degree-university.service';
import { DegreeUniversityController } from './degree-university.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeUniversity } from './entities/degree-university.entity';
import { Degree } from 'src/degree/entities/degree.entity';
import { University } from 'src/university/entities/university.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      DegreeUniversity,Degree,University
    ])
  ],
  controllers: [DegreeUniversityController],
  providers: [DegreeUniversityService],
})
export class DegreeUniversityModule {}
