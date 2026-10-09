import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PasswordReset } from './entities/forget-password.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

@Module({
  imports:[
  TypeOrmModule.forFeature([
    Account,PasswordReset
  ]),
PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: process.env.RE_JWT_SECRET,
          signOptions: {
            expiresIn: '1h'//process.env.RE_JWT_EXPIRE,
          },
        };
      },
    }),
NodeMailerModule
  ],
  
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
