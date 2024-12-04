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
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { Plan } from './plan.entity';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  async createPlan(@Body() body: any): Promise<Plan> {
    const planData: any = {};

    Object.keys(body).forEach((key) => {
      planData[key] = body[key];
    });

    return await this.planService.createPlan(planData);
  }

  @Put()
  async updateParentPlan(
    @Body() data: { id: number; color: string; title: string; text: string },
  ): Promise<Plan> {
    return await this.planService.updateParentPlan(data);
  }

  @Get('/all')
  async findAllPlans(): Promise<Plan[]> {
    return await this.planService.findAllPlans();
  }

  @Get('parent')
  async findParentPlansByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate와 endDate는 필수입니다.');
    }

    return await this.planService.findParentPlansWithChildStats(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('child')
  async findChildPlansByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Plan[]> {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate와 endDate는 필수입니다.');
    }

    return await this.planService.findChildPlansByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('toggle-done')
  async toggleDone(@Body() body: { id: number }): Promise<void> {
    if (!body.id) {
      throw new BadRequestException('id는 필수입니다.');
    }

    await this.planService.toggleDone(body.id);
  }

  @Delete(':id')
  async deletePlan(@Param('id') id: number): Promise<void> {
    await this.planService.deletePlan(id);
  }
}
