import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly repo: Repository<Board>,
  ) {}

  async create(dto: CreateBoardDto) {
    const board = await this.repo.findOne({
      where: { name: dto.name },
    });

    if (board) {
      throw new ConflictException('Board already exists');
    }

    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('board')
      .where('board.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'board.name LIKE :name  ',
            {
              name: '%' + keyword + '%',
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
    const board = await this.repo.findOne({ where: { id } });
    if (!board) {
      throw new NotFoundException('User not found!');
    }
    const obj = Object.assign(board, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}