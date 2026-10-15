import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VideoLecture } from './entities/video-lecture.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { CreateVideoLactureDto } from './dto/create-video-lecture.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class VideoLectureService {
  constructor(
    @InjectRepository(VideoLecture)
    private readonly repo: Repository<VideoLecture>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateVideoLactureDto) {
    const subject = await this.subjectRepo.findOne({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Video not found');
    }

    const existing = await this.repo.findOne({
      where: {
        title: dto.title,
        subject: { id: dto.subjectId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Video Lacture  already exists for this subject',
      );
    }
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('videoLacture')
      .leftJoinAndSelect('videoLacture.subject', 'subject')
      .where('videoLacture.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'videoLacture.title LIKE :title or subject.name LIKE :name ',
            {
              title: '%' + keyword + '%',
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
    const videoLacture = await this.repo.findOne({ where: { id } });
    if (!videoLacture) {
      throw new NotFoundException('Video Lacture not found');
    }
    const obj = Object.assign(videoLacture, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
