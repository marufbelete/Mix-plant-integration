import { Module } from "@nestjs/common";
import { MixPlantModule } from "./mix_plant/mix_plant.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
// import { WeightBridgeModule } from "./weight_bridge/weight_bridge.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MixPlantModule,
    PrismaModule,
    // WeightBridgeModule,
  ],
})
export class AppModule {
  constructor() {
    //impl
  }
}
