import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyMaterial } from './entities/study-material.entity';
import { Brackets, Repository } from 'typeorm';
import { Subject } from 'src/subject/entities/subject.entity';
import { CreateStudyMaterialDto } from './dto/create-study-material.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class StudyMaterialService {
  constructor(
    @InjectRepository(StudyMaterial)
    private readonly repo: Repository<StudyMaterial>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateStudyMaterialDto) {
    const subject = await this.subjectRepo.findOne({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const existing = await this.repo.findOne({
      where: {
        title: dto.title,
        subject: { id: dto.subjectId },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Study material  already exists for this subject',
      );
    }
  }

  async pdf(image: string, result: StudyMaterial) {
    const obj = Object.assign(result, {
      pdf_file_url: process.env.RE_CDN_LINK + image,
      pdf_file_path: image,
    });

    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, count] = await this.repo
      .createQueryBuilder('studyMaterial')
      .leftJoinAndSelect('studyMaterial.subject', 'subject')
      .where('studyMaterial.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'studyMaterial.title LIKE :title or subject.name LIKE :name ',
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
    const studyMaterial = await this.repo.findOne({ where: { id } });
    if (!studyMaterial) {
      throw new NotFoundException('Study Materials not found');
    }
    const obj = Object.assign(studyMaterial, { status: DefaultStatus.DELETED });
    return this.repo.save(obj);
  }
}
