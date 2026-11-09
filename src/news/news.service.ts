import { News } from './entities/news.entity';
import { Brackets, Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly repo: Repository<News>,
  ) {}

  async create(dto: CreateNewsDto) {
    const existing = await this.repo.findOne({
      where: {
        title: dto.title,
      },
    });

    if (existing) {
      throw new ConflictException('News already exists');
    }

    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async news(image: string, result: News) {
    const obj = Object.assign(result, {
      image_url: process.env.RE_CDN_LINK + image,
      image_path: image,
    });

    return this.repo.save(obj);
  }


  async findAll(dto: DefaultStatusPaginationDto) {
      const keyword = dto.keyword || '';
      const [result, count] = await this.repo
        .createQueryBuilder('news')
        .where('news.status = :status', { status: dto.status })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              'news.title LIKE :title or news.description LIKE :description ',
              {
                title: '%' + keyword + '%',
                description: '%' + keyword + '%',
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
      const result = await this.repo.findOne({
        where: { id },
      });
  
      if (!result) {
        throw new NotFoundException('News not found');
      }
      return result;
    }
  
    async remove(id: string) {
      const news = await this.repo.findOne({ where: { id } });
      if (!news) {
        throw new NotFoundException('news not found');
      }
      const obj = Object.assign(news, { status: DefaultStatus.DELETED });
      return this.repo.save(obj);
    }
}