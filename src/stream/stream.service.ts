import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stream } from './entities/stream.entity';
import { Brackets, Repository } from 'typeorm';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { CreateStreamDto } from './dto/create-stream.dto';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Stream) private readonly repo: Repository<Stream>,
    @InjectRepository(SchoolClass)
    private readonly schoolClassRepo: Repository<SchoolClass>,
  ) {}

  async create(dto: CreateStreamDto) {
    const schoolClass = await this.schoolClassRepo.findOne({
      where: { id: dto.schoolClassId },
    });

    if (!schoolClass) {
      throw new NotFoundException('School class not found');
    }

    const existingStream = await this.repo.findOne({
      where: {
        name: dto.name,
        schoolClass: { id: dto.schoolClassId },
      },
    });

    if (existingStream) {
      throw new ConflictException(
        'This stream already exists for this school class',
      );
    }

    const obj = Object.create({...dto,schoolClass: schoolClass});

    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('stream')
      .where('stream.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('stream.name LIKE :name ', {
            name: '%' + keyword + '%',
          });
        }),
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, count };
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const stream = await this.repo.findOne({ where: { id } });
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    const obj = Object.assign(stream, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
