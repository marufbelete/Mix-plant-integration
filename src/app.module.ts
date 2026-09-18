import { Module } from "@nestjs/common";
import { MixPlantModule } from "./mix_plant/mix_plant.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MixPlantModule,
    PrismaModule,
  ],
})
export class AppModule {
  constructor() {
    //impl
  }
}
