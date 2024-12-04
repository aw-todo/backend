import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ParentPlanWithStatsDto {
  @ApiProperty({ description: '부모 플랜 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '부모 플랜 제목', example: '프로젝트 계획' })
  title: string;

  @ApiProperty({
    description: '부모 플랜 내용',
    example: '프로젝트 진행을 위한 주요 단계',
    required: false,
  })
  @IsOptional()
  text?: string;

  @ApiProperty({
    description: '플랜 시작 날짜',
    example: '2024-01-01T00:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: '플랜 종료 날짜',
    example: '2024-01-07T00:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({ description: '완료 여부', example: false })
  done: boolean;

  @ApiProperty({ description: '플랜 색상', example: '#4287f5' })
  color: string;

  @ApiProperty({ description: '총 자식 플랜 수', example: 5 })
  totalChildren: number;

  @ApiProperty({ description: '완료된 자식 플랜 수', example: 3 })
  completedChildren: number;
}
