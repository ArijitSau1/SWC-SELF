import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Brackets, Repository } from 'typeorm';
import {
  CreateAccountDto,
  PaginationDto,
  UpdateProfileDto,
} from './dto/account.dto';
import * as bcrypt from 'bcrypt';
import { DefaultStatus } from 'src/enum';
import { uploadFileHandler } from 'src/utils/fileUpload.utils';
import * as fs from 'fs';

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
    const object = Object.create({
      accountId: payload.id,
    });
    return payload;
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('account')
      .where('account.status = :status AND account.roles = :roles', {
        status: dto.status,
        roles: dto.role,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('account.email LIKE :email OR account.name LIKE :name', {
            email: '%' + keyword + '%',
            name: '%' + keyword + '%',
          });
        }),
      )
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();
    return { result, total };
  }

  async userProfile(id: string) {
    const user = await this.repo
      .createQueryBuilder('account')
      .select([
        'account.id',
        'account.name',
        'account.email',
        'account.phone',
        'account.age',
        'account.gender',
        'account.institution',
        'account.address',
        'account.profileImageUrl',
        'account.createdAt',
      ])
      .where('account.id = :id', { id: id })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.repo.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(user, dto);

    return this.repo.save(obj);
  }

  async profileImage(file: Express.Multer.File, result: Account) {
    const buffer = fs.readFileSync(file.path);

    const image = `Profile/${file.filename}`;

    await uploadFileHandler(image, buffer);

    const obj = Object.assign(result, {
      profileImageUrl: process.env.RE_CDN_LINK + image,
      profileImagePath: image,
    });

    return this.repo.save(obj);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const obj = Object.assign(user, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
