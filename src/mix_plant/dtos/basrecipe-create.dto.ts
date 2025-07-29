import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class BasrecipeCreateDto {
  @IsOptional()
  @IsString()
  pk?: string;

  @IsOptional()
  @IsInt()
  pxxh?: number;

  @IsOptional()
  @IsString()
  pk_station?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  @IsInt()
  mixTime?: number;

  @IsOptional()
  @IsDateString()
  oper_date?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsBoolean()
  flagsj?: boolean;

  @IsOptional()
  @IsString()
  oper?: string;

  @IsOptional()
  @IsString()
  oldpk?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsNumber()
  lqtotal?: number;

  @IsOptional()
  @IsBoolean()
  plsav?: boolean;

  @IsOptional()
  @IsNumber()
  fjj1_0?: number;

  @IsOptional()
  @IsNumber()
  fjj1_1?: number;

  @IsOptional()
  @IsNumber()
  fjj1_2?: number;

  @IsOptional()
  @IsNumber()
  fjj1_3?: number;

  @IsOptional()
  @IsNumber()
  fjj1_4?: number;

  @IsOptional()
  @IsNumber()
  fjj1_5?: number;

  @IsOptional()
  @IsNumber()
  fjj1_6?: number;

  @IsOptional()
  @IsNumber()
  fjj1_7?: number;

  @IsOptional()
  @IsString()
  intensityLevel?: string;

  @IsOptional()
  @IsString()
  ksd?: string;

  @IsOptional()
  @IsString()
  kzd?: string;

  @IsOptional()
  @IsString()
  tld?: string;

  @IsOptional()
  @IsString()
  sljdj?: string;

  @IsOptional()
  @IsString()
  sszdlj?: string;

  @IsOptional()
  @IsNumber()
  sjb?: number;

  @IsOptional()
  @IsNumber()
  sl?: number;

  @IsOptional()
  @IsNumber()
  bgmd?: number;

  @IsOptional()
  @IsNumber()
  OnOrder?: number;
}
