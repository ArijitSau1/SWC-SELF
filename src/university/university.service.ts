import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateUniversityDto } from './dto/create-university.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class UniversityService {
    constructor(
        @InjectRepository(University)
        private readonly repo: Repository<University>,
      ) {}

      async create(dto: CreateUniversityDto) {
            const university  = await this.repo.findOne({
              where: { name: dto.name },
            });
        
            if (university) {
              throw new ConflictException('University already exists');
            }
        
            const obj = Object.assign(dto);
            return this.repo.save(obj);
          }
      
            async findAll(dto: DefaultStatusPaginationDto) {
              const keyword = dto.keyword || '';
              const [result, count] = await this.repo
                .createQueryBuilder('university')
                .where('university.status = :status', { status: dto.status })
                .andWhere(
                  new Brackets((qb) => {
                    qb.where(
                      'university.name LIKE :name  ',
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
              const university = await this.repo.findOne({ where: { id } });
              if (!university) {
                throw new NotFoundException('User not found!');
              }
              const obj = Object.assign(university, { status: DefaultStatus.DELETED });
              return this.repo.save(obj);
            }
}
