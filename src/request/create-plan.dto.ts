import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ description: '플랜 제목', example: '새로운 플랜' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '플랜 내용',
    example: '백준 한 문제 풀기',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    description: '플랜 시작 날짜',
    example: '2024-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: '플랜 종료 날짜',
    example: '2024-01-07',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: '완료 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  done?: boolean;

  @ApiProperty({ description: '플랜 색상', example: '#FF5733' })
  @IsString()
  color: string;

  @ApiProperty({
    description: '상위 플랜 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  parentPlan?: number;
}
