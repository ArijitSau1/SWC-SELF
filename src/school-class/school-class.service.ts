import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolClass } from './entities/school-class.entity';
import { Brackets, Repository } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { CreateSchoolClassDto } from './dto/create-school-class.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class SchoolClassService {
  constructor(
    @InjectRepository(SchoolClass)
    private readonly repo: Repository<SchoolClass>,
    @InjectRepository(Board) private readonly bRepo: Repository<Board>,
  ) {}

  async create(dto: CreateSchoolClassDto) {
    const board = await this.bRepo.findOne({
      where: { id: dto.boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const existingClass = await this.repo.findOne({
      where: {
        name: dto.name,
        tier: dto.tier,
        board: {id:dto.boardId},
      },
    });

    if (existingClass) {
      throw new ConflictException(
        'This class already exists for this board and tier',
      );
    }

     const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

    async findAll(dto: DefaultStatusPaginationDto) {
      const keyword = dto.keyword || '';
      const [result, count] = await this.repo
        .createQueryBuilder('schoolClass')
        .where('schoolClass.status = :status', { status: dto.status })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              'schoolClass.name LIKE :name or schoolClass.tier LIKE :tier ',
              {
                name: '%' + keyword + '%',
                tier: '%' + keyword + '%'
              },
            );
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
      const schoolClass = await this.repo.findOne({ where: { id } });
      if (!schoolClass) {
        throw new NotFoundException('User not found!');
      }
      const obj = Object.assign(schoolClass, { status: DefaultStatus.DELETED });
      return this.repo.save(obj);
    }

}
