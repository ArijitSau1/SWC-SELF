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
    SchoolClassModule
  ],
  controllers: [AppController, NodeMailerController],
  providers: [AppService, NodeMailerService,],
})
export class AppModule {}
