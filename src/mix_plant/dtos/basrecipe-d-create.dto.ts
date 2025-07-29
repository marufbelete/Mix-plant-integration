import { IsOptional, IsString, IsInt, IsNumber } from "class-validator";

export class BasrecipeDCreateDto {
  @IsOptional()
  @IsString()
  pk?: string;

  @IsOptional()
  @IsInt()
  pxxh?: number;

  @IsOptional()
  @IsString()
  pk_m?: string;

  @IsOptional()
  @IsString()
  pk_Storage?: string;

  @IsOptional()
  @IsNumber()
  qty?: number;

  @IsOptional()
  @IsString()
  remark?: string;
}
