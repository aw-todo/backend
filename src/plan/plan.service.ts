import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './plan.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async createPlan(data: any): Promise<Plan> {
    this.validateCreatePlanData(data);

    const parentPlan: Plan = await this.findParentPlan(data);

    const newPlan: Plan = this.planRepository.create({
      title: data.title,
      text: data.text || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      done: data.done || false,
      color: data.color,
      parentPlan: parentPlan,
    });

    return await this.planRepository.save(newPlan);
  }

  async updateParentPlan(data: {
    id: number;
    color: string;
    title: string;
    text: string;
  }): Promise<Plan> {
    const plan: Plan = await this.planRepository.findOne({
      where: { id: data.id },
    });
    if (!plan) {
      throw new NotFoundException('해당 ID의 계획을 찾을 수 없습니다.');
    }

    plan.color = data.color;
    plan.title = data.title;
    plan.text = data.text;

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

  private async validateCreatePlanData(data: any) {
    if (!data.title || !data.startDate || !data.endDate || !data.color) {
      throw new BadRequestException('필수 필드가 누락되었습니다.');
    }
  }

  private async findParentPlan(data: any) {
    let parentPlan: Plan | null = null;
    if (data.parentPlan) {
      parentPlan = await this.planRepository.findOne({
        where: { id: data.parentPlan },
      });
      if (!parentPlan) {
        throw new BadRequestException('상위 계획이 존재하지 않습니다.');
      }
    }
    return parentPlan;
  }
}
