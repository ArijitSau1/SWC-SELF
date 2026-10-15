import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { AccountService } from './account/account.service';
import { AuthModule } from './auth/auth.module';
import { NodeMailerController } from './node-mailer/node-mailer.controller';
import { NodeMailerService } from './node-mailer/node-mailer.service';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { BoardModule } from './board/board.module';
import { SchoolClassModule } from './school-class/school-class.module';
import { StreamModule } from './stream/stream.module';
import { SemesterModule } from './semester/semester.module';
import { SubjectModule } from './subject/subject.module';
import { DegreeModule } from './degree/degree.module';
import { UniversityModule } from './university/university.module';
import { DegreeUniversityModule } from './degree-university/degree-university.module';
import { StudyMaterialModule } from './study-material/study-material.module';
import { VideoLectureController } from './video-lecture/video-lecture.controller';
import { VideoLectureModule } from './video-lecture/video-lecture.module';
import { AudioLectureModule } from './audio-lecture/audio-lecture.module';
import { MockTestModule } from './mock-test/mock-test.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
       type: 'mysql',
      host: process.env.RE_DB_HOST,
      port: Number(process.env.RE_DB_PORT),
      username: process.env.RE_USER_NAME,
      password: process.env.RE_DB_PASS,
      database: process.env.RE_DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AccountModule,
    AuthModule,
    NodeMailerModule,
    BoardModule,
    SchoolClassModule,
    StreamModule,
    SemesterModule,
    SubjectModule,
    DegreeModule,
    UniversityModule,
    DegreeUniversityModule,
    StudyMaterialModule,
    VideoLectureModule,
    AudioLectureModule,
    MockTestModule
  ],
  controllers: [AppController, NodeMailerController,],
  providers: [AppService, NodeMailerService,],
})
export class AppModule {}
