import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  PaginationDto,
  UpdateProfileDto,
} from './dto/account.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from './entities/account.entity';
import { imageFileFilter } from 'src/utils/fileUpload.utils';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  find(@Query() query: PaginationDto) {
    return this.accountService.find(query);
  }

  @Get('userProfile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  userProfile(@CurrentUser() user: Account) {
    return this.accountService.userProfile(user.id);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @CurrentUser() user: Account,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.accountService.updateProfile(user.id, dto);
  }

  @Put('picture/:id')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Profile',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async audio(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.accountService.userProfile(id);
    return this.accountService.profileImage(file, fileData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
