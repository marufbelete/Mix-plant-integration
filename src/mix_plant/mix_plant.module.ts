import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MixPlantService } from "./mix_plant.service";
import { MixPlantController } from "./mix_plant.controller";

@Module({
  imports: [],
  //runs according to given sequence
  providers: [MixPlantService],
  controllers: [MixPlantController],
})
export class MixPlantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
  }
}
