import { Module } from '@nestjs/common';
import { StudyMaterialController } from './study-material.controller';
import { StudyMaterialService } from './study-material.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyMaterial } from './entities/study-material.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      StudyMaterial,Subject
    ])
  ],
  controllers: [StudyMaterialController],
  providers: [StudyMaterialService]
})
export class StudyMaterialModule {}
