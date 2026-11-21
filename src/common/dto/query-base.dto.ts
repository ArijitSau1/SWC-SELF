// import { Transform } from 'class-transformer';
// import {
//   IsDateString,
//   IsEnum,
//   IsOptional,
//   IsPositive,
//   IsString,
//   IsUUID,
//   Max,
//   MaxLength,
//   Min,
// } from 'class-validator';
// import { SortOrder } from '../enums/sort.enum';

// export class QueryBaseDto {
//   @ApiPropertyOptional({ description: 'Search term', maxLength: 100 })
//   @IsOptional()
//   @Transform(({ value }) => (value === '' ? undefined : value))
//   @IsString()
//   @MaxLength(1000)
//   search?: string;

//   @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
//   @IsOptional()
//   @Transform(({ value }) => Number.parseInt(value as string))
//   @IsPositive()
//   @Min(1)
//   page?: number = 1;

//   @ApiPropertyOptional({
//     description: 'Items per page',
//     default: 10,
//     minimum: 1,
//     maximum: 100,
//   })
//   @IsOptional()
//   @Transform(({ value }) => Number.parseInt(value as string))
//   @IsPositive()
//   @Min(1)
//   @Max(100)
//   limit?: number = 10;

//   @ApiPropertyOptional({ description: 'Sort by field' })
//   @IsOptional()
//   @IsString()
//   sortKey?: string;

//   @ApiPropertyOptional({
//     description: 'Sort order (empty string for no sorting)',
//     enum: SortOrder,
//     default: SortOrder.NONE,
//   })
//   @IsOptional()
//   @IsEnum(SortOrder)
//   sortValue?: SortOrder = SortOrder.NONE;

//   @ApiPropertyOptional({ description: 'Filter from date (ISO string)' })
//   @IsOptional()
//   @IsDateString()
//   fromDate?: string;

//   @ApiPropertyOptional({ description: 'Filter to date (ISO string)' })
//   @IsOptional()
//   @IsDateString()
//   toDate?: string;

//   @ApiPropertyOptional({ description: 'Account ID filter' })
//   @IsOptional()
//   @IsUUID()
//   accountId?: string;
// }