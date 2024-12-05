import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { PlanService } from "./plan.service";
import { Plan } from "./plan.entity";
import { CreatePlanDto } from "../request/create-plan.dto";
import { UpdateParentPlanDto } from "../request/update-parent-plan.dto";
import { UpdateChildPlanDto } from "../request/update-child-plan.dto";
import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { ParentPlanWithStatsDto } from "../response/parent-plan-with-stats.dto";
import { ChildPlanWithParentDto } from "../response/child-plan-with-parent.dto";
import { ToggleDoneDto } from "../request/toggle-done.dto";

@Controller("plan")
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Post()
    async createPlan(@Body() data: CreatePlanDto): Promise<void> {
        await this.planService.createPlan(data);
    }

    @Put("/parent")
    async updateParentPlan(
        @Body() request: UpdateParentPlanDto
    ): Promise<Plan> {
        return await this.planService.updateParentPlan(request);
    }

    @Put("/child")
    async updateChilePlan(@Body() request: UpdateChildPlanDto): Promise<void> {
        return await this.planService.updateChildPlan(request);
    }

    /**
     * 디버깅용 API
     * @description 모든 계획을 조회합니다.
     * @returns {Plan[]} 모든 계획
     */
    @Get("/all")
    async findAllPlans(): Promise<Plan[]> {
        return await this.planService.findAllPlans();
    }

    @ApiQuery({
        name: "startDate",
        description: "시작 날짜",
        example: "2024-01-01",
    })
    @ApiQuery({
        name: "endDate",
        description: "종료 날짜",
        example: "2024-01-31",
    })
    @ApiResponse({
        status: 200,
        description: "부모 플랜 목록과 자식 플랜 통계 정보를 반환합니다.",
        type: [ParentPlanWithStatsDto],
    })
    @Get("parent")
    async findParentPlansByDateRange(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ): Promise<UpdateParentPlanDto[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException("startDate와 endDate는 필수입니다.");
        }

        return await this.planService.findParentPlansWithChildStats(
            new Date(startDate),
            new Date(endDate)
        );
    }

    @ApiQuery({
        name: "startDate",
        description: "시작 날짜",
        example: "2024-01-01",
    })
    @ApiQuery({
        name: "endDate",
        description: "종료 날짜",
        example: "2024-01-31",
    })
    @ApiResponse({
        status: 200,
        description: "특정 기간에 속하는 자식 플랜 목록을 반환합니다.",
        type: [ChildPlanWithParentDto],
    })
    @Get("child")
    async findChildPlansByDateRange(
        @Query("startDate") startDate: string,
        @Query("endDate") endDate: string
    ): Promise<ChildPlanWithParentDto[]> {
        if (!startDate || !endDate) {
            throw new BadRequestException("startDate와 endDate는 필수입니다.");
        }

        return await this.planService.findChildPlansByDateRange(
            new Date(startDate),
            new Date(endDate)
        );
    }

    @Post("toggle-done")
    async toggleDone(@Body() request: ToggleDoneDto): Promise<void> {
        if (!request.id) {
            throw new BadRequestException("id는 필수입니다.");
        }

        await this.planService.toggleDone(request.id);
    }

    @Delete(":id")
    async deletePlan(@Param("id") id: number): Promise<void> {
        await this.planService.deletePlan(id);
    }
}
