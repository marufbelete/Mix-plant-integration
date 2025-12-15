// src/weight_bridge/weight_bridge.controller.ts
import { Body, Controller, Get, Post } from "@nestjs/common";
import { WeightBridgeService } from "./weight_bridge.service";
import { WeightBridgeConfigDto } from "./dto/weight-bridge-config.dto";

@Controller("weight-bridge")
export class WeightBridgeController {
  private readonly WEIGH_BRIDGE = "Bridge A";
  constructor(private readonly weightBridgeService: WeightBridgeService) {}

  @Get("test")
  test() {
    return { message: "WeightBridge controller is working!" };
  }

  @Get("status")
  getStatus() {
    return this.weightBridgeService.getConnectionStatus();
  }

  @Post("configure")
  async configure(@Body() config: WeightBridgeConfigDto) {
    await this.weightBridgeService.updateConfig(config);
    return {
      message: "Configuration updated (reconnect required)",
      config,
    };
  }

  @Get("weight")
  getWeight() {
    return {
      weight: this.weightBridgeService.getCurrentWeight(),
      unit: "kg",
      weighBridge: this.WEIGH_BRIDGE,
    };
  }
}
