import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ToggleDoneDto {
    @ApiProperty({ description: "플랜 ID", example: 1 })
    @IsNumber()
    id: number;
}
