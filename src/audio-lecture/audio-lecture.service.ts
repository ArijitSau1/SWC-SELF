import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AudioLecture } from './entities/audio-lecture.entity';
import { Brackets, Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { CreateAudioLactureDto } from './dto/create-audio-lecture.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AudioLectureService {
  constructor(
    @InjectRepository(AudioLecture)
    private readonly repo: Repository<AudioLecture>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateAudioLactureDto) {
    const subject = await this.subjectRepo.findOne({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Audio not found');
    }

    const existing = await this.repo.findOne({
      where: {
        title: dto.title,
        subject: { id: dto.subjectId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Audio Lacture  already exists for this subject',
      );
    }
  }

  async audio(image: string, result: AudioLecture) {
    const obj = Object.assign(result, {
      pdf_file_url: process.env.RE_CDN_LINK + image,
      pdf_file_path: image,
    });

    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('audioLacture')
      .leftJoinAndSelect('audioLacture.subject', 'subject')
      .where('audioLacture.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'audioLacture.title LIKE :title or subject.name LIKE :name ',
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
    const result = await this.repo.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Study material not found');
    }
    return result;
  }

  async remove(id: string) {
    const mockTest = await this.repo.findOne({ where: { id } });
    if (!mockTest) {
      throw new NotFoundException('Mock test not found');
    }
    const obj = Object.assign(mockTest, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
