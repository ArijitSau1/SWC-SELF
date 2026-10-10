import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stream } from './entities/stream.entity';
import { Brackets, Repository } from 'typeorm';
import { SchoolClass } from 'src/school-class/entities/school-class.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class StreamService {
    constructor(@InjectRepository(Stream) private readonly repo:Repository<Stream>,
    @InjectRepository(SchoolClass)private readonly schoolClassRepo: Repository<SchoolClass>,){}

    

    async findAll(dto: DefaultStatusPaginationDto) {
          const keyword = dto.keyword || '';
          const [result, count] = await this.repo
            .createQueryBuilder('stream')
            .where('stream.status = :status', { status: dto.status })
            .andWhere(
              new Brackets((qb) => {
                qb.where(
                  'stream.name LIKE :name ',
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
          const stream = await this.repo.findOne({ where: { id } });
          if (!stream) {
            throw new NotFoundException('User not found!');
          }
          const obj = Object.assign(stream, { status: DefaultStatus.DELETED });
          return this.repo.save(obj);
        }
    

}
