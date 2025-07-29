import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class WeightBridgeConfigDto {
  @IsString()
  @IsNotEmpty()
  port: string; // e.g. 'COM4' or '/dev/ttyUSB0'

  @IsInt()
  baudRate: number = 9600;

  @IsInt()
  dataBits: 7 | 8 = 8;

  @IsString()
  parity: "none" | "even" | "odd" = "none";

  @IsInt()
  stopBits: 1 | 2 = 1;

  @IsString()
  protocolMode: string = "TF0"; // TF0 (ASCII), TF2/TF3 (continuous)
}
