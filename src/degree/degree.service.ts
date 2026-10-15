import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Degree } from './entities/degree.entity';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class DegreeService {
    constructor(
    @InjectRepository(Degree)
    private readonly repo: Repository<Degree>,
  ) {}

   async create(dto: CreateDegreeDto) {
      const board = await this.repo.findOne({
        where: { name: dto.name },
      });
  
      if (board) {
        throw new ConflictException('Degree already exists');
      }
  
      const obj = Object.assign(dto);
      return this.repo.save(obj);
    }

      async findAll(dto: DefaultStatusPaginationDto) {
        const keyword = dto.keyword || '';
        const [result, count] = await this.repo
          .createQueryBuilder('degree')
          .where('degree.status = :status', { status: dto.status })
          .andWhere(
            new Brackets((qb) => {
              qb.where(
                'degree.name LIKE :name  ',
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
        const degree = await this.repo.findOne({ where: { id } });
        if (!degree) {
          throw new NotFoundException('User not found!');
        }
        const obj = Object.assign(degree, { status: DefaultStatus.DELETED });
        return this.repo.save(obj);
      }
}
