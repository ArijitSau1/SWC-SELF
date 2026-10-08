import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto, PaginationDto } from './dto/account.dto';
import * as bcrypt from 'bcrypt';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
  ) {}
  async create(dto: CreateAccountDto) {
    const user = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (user) {
      throw new ConflictException('Account already exists');
    }

    const encryptedPassword = await bcrypt.hash(dto.password, 13);
    const obj = Object.create({
      name: dto.name,
      email: dto.email,
      password: encryptedPassword,
    });
    const payload = await this.repo.save(obj);
    console.log(payload);
    const object = Object.create({
      accountId: payload.id,
    });
    return payload;
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.createdAt',
      ])
      .where('account.email LIKE :email OR account.name LIKE :name', {
        email: '%' + keyword + '%',
        name: '%' + keyword + '%',
      })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const user = await this.repo
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.createdAt',
      ])
      .where('account.id=:id', {id}).getOne();
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(user, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
