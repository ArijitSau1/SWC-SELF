import { Controller } from '@nestjs/common';
import { MockTestService } from './mock-test.service';

@Controller('mock-test')
export class MockTestController {
  constructor(private readonly mockTestService: MockTestService) {}
}
