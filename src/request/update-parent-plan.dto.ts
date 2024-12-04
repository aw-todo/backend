import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateParentPlanDto {
  @ApiProperty({ description: '플랜 ID', example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: '플랜 색상',
    example: '#FF5733',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: '플랜 제목',
    example: '업데이트된 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '플랜 내용',
    example: '업데이트된 플랜 내용입니다.',
    required: false,
  })
  @IsString()
  text: string;
}
