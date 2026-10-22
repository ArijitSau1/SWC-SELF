import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTestAttemptDto {
  @IsUUID()
  @IsNotEmpty()
  mockTestId: string;
}