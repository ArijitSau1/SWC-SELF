import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}