import { Module } from '@nestjs/common';
import { VideoLectureService } from './video-lecture.service';
import { VideoLectureController } from './video-lecture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLecture } from './entities/video-lecture.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      VideoLecture,Subject
    ])
  ],
  controllers: [VideoLectureController],
  providers: [VideoLectureService],
})
export class VideoLectureModule {}
