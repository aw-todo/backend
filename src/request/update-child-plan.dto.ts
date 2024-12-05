import { IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateChildPlanDto {
    @ApiProperty({ description: "플랜 ID", example: 1 })
    @IsNumber()
    id: number;

    @ApiProperty({ description: "상위 플랜 ID", example: 2 })
    @IsNumber()
    parent: number;

    @ApiProperty({ description: "플랜 제목", example: "업데이트된 자식 제목" })
    @IsString()
    title: string;

    @ApiProperty({
        description: "플랜 내용",
        example: "업데이트된 자식 플랜 내용입니다.",
        required: false,
    })
    @IsOptional()
    @IsString()
    text?: string;
}
