import { Module } from '@nestjs/common';
import { AudioLectureController } from './audio-lecture.controller';
import { AudioLectureService } from './audio-lecture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioLecture } from './entities/audio-lecture.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports:[TypeOrmModule.forFeature([
    AudioLecture,Subject
  ])],
  controllers: [AudioLectureController],
  providers: [AudioLectureService]
})
export class AudioLectureModule {}
