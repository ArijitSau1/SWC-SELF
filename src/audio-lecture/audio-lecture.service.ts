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
import { uploadFileHandler } from 'src/utils/fileUpload.utils';
import * as fs from 'fs';

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

    const obj = Object.assign({...dto,subject:subject});
    return this.repo.save(obj);
  }

  // async audio(image: string, result: AudioLecture) {
  //   const obj = Object.assign(result, {
  //     audio_file_url: process.env.RE_CDN_LINK + image,
  //     audio_file_path: image,
  //   });

  //   return this.repo.save(obj);
  // }


  async audio(file: Express.Multer.File, result: AudioLecture) {
  const buffer = fs.readFileSync(file.path);

  const image = `AudioLecture/${file.filename}`;

  await uploadFileHandler(image, buffer);

  const obj = Object.assign(result, {
    audio_file_url: process.env.RE_CDN_LINK + image,
    audio_file_path: image,
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
    const audio = await this.repo.findOne({ where: { id } });
    if (!audio) {
      throw new NotFoundException('audio not found');
    }
    const obj = Object.assign(audio, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
