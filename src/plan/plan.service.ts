import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './plan.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { CreatePlanDto } from '../request/create-plan.dto';
import { UpdateParentPlanDto } from '../request/update-parent-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async createPlan(request: CreatePlanDto): Promise<Plan> {
    const parentPlan: Plan = await this.findParentPlan(request);

    const newPlan: Plan = this.planRepository.create({
      title: request.title,
      text: request.text || null,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      done: request.done || false,
      color: request.color,
      parentPlan: parentPlan,
    });

    return await this.planRepository.save(newPlan);
  }

  async updateParentPlan(request: UpdateParentPlanDto): Promise<Plan> {
    const plan: Plan = await this.planRepository.findOne({
      where: { id: request.id },
    });
    if (!plan) {
      throw new NotFoundException('해당 ID의 계획을 찾을 수 없습니다.');
    }

    plan.color = request.color;
    plan.title = request.title;
    plan.text = request.text;

    return await this.planRepository.save(plan);
  }

  async findAllPlans(): Promise<Plan[]> {
    return await this.planRepository.find({
      relations: ['parentPlan'],
      order: {
        startDate: 'ASC',
      },
    });
  }

  async findParentPlansWithChildStats(
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    const parentPlans = await this.planRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        parentPlan: IsNull(),
      },
      relations: ['parentPlan'],
      order: { startDate: 'ASC' },
    });

    return await Promise.all(
      parentPlans.map(async (parentPlan) => {
        const childPlans = await this.planRepository.find({
          where: { parentPlan: { id: parentPlan.id } },
        });
        const completedChildren = childPlans.filter(
          (child) => child.done,
        ).length;
        return {
          ...parentPlan,
          totalChildren: childPlans.length,
          completedChildren,
        };
      }),
    );
  }

  async findChildPlansByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Plan[]> {
    return await this.planRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        parentPlan: Not(IsNull()),
      },
      relations: ['parentPlan'],
      order: { startDate: 'ASC' },
    });
  }

  async toggleDone(id: number): Promise<void> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['parentPlan'],
    });
    if (!plan) {
      throw new NotFoundException('해당 계획을 찾을 수 없습니다.');
    }

    if (!plan.parentPlan) {
      throw new BadRequestException('상위 계획은 수정할 수 없습니다.');
    }

    plan.done = !plan.done;
    await this.planRepository.save(plan);
    await this.updateParentDoneStatus(plan.parentPlan.id);
  }

  async deletePlan(id: number): Promise<void> {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('해당 계획을 찾을 수 없습니다.');
    }

    await this.planRepository.remove(plan);
  }

  private async updateParentDoneStatus(parentId: number): Promise<void> {
    const parentPlan = await this.planRepository.findOne({
      where: { id: parentId },
      relations: ['parentPlan'],
    });

    if (!parentPlan) {
      throw new NotFoundException('상위 계획을 찾을 수 없습니다.');
    }

    const childPlans = await this.planRepository.find({
      where: { parentPlan: { id: parentId } },
    });

    parentPlan.done = childPlans.every((child) => child.done);
    await this.planRepository.save(parentPlan);
  }

  private async findParentPlan(request: CreatePlanDto) {
    let parentPlan: Plan | null = null;
    if (request.parentPlan) {
      parentPlan = await this.planRepository.findOne({
        where: { id: request.parentPlan },
      });
      if (!parentPlan) {
        throw new BadRequestException('상위 계획이 존재하지 않습니다.');
      }
    }
    return parentPlan;
  }
}
