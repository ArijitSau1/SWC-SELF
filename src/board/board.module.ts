import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
TypeOrmModule.forFeature([Board]),
AuthModule
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
