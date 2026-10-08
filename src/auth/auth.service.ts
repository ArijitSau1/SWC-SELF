import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.getUserDetails(email);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);

    return { token };
  }

    validate(id: string) {
    return this.getUserDetails(id);
  }

  private readonly getUserDetails = async (id: string): Promise<any> => {
    const query = this.repo.createQueryBuilder('account');

    const result = await query
      .where('account.id = :id OR account.email = :email', {
        id:id,
        email: id,
      })
      .getOne();

    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }

    return result;
  };
}
