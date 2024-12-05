import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanModule } from "./plan/plan.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: ":memory:",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
            logging: true,
        }),
        PlanModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
