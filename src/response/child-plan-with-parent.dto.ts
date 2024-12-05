import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class ChildPlanWithParentDto {
    @ApiProperty({ description: "자식 플랜 ID", example: 5 })
    id: number;

    @ApiProperty({ description: "자식 플랜 제목", example: "세부 계획" })
    title: string;

    @ApiProperty({
        description: "자식 플랜 내용",
        example: "프로젝트 세부 작업입니다.",
    })
    @IsOptional()
    text?: string;

    @ApiProperty({
        description: "자식 플랜 시작 날짜",
        example: "2024-01-05T09:00:00.000Z",
    })
    startDate: Date;

    @ApiProperty({
        description: "자식 플랜 종료 날짜",
        example: "2024-01-07T18:00:00.000Z",
    })
    endDate: Date;

    @ApiProperty({ description: "완료 여부", example: false })
    done: boolean;

    @ApiProperty({ description: "플랜 색상", example: "#4287f5" })
    color: string;

    @ApiProperty({
        description: "상위 플랜 정보",
        example: {
            id: 1,
            title: "상위 플랜 제목",
            color: "#FF5733",
        },
    })
    parentPlan: {
        id: number;
        title: string;
        color: string;
    };
}
