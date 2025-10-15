import { PartialType } from "@nestjs/mapped-types";
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePrdbillDto {
  @IsOptional()
  @IsString()
  pk: string;

  @IsOptional()
  @IsInt()
  pxxh?: number;

  @IsOptional()
  @IsString()
  pk_station?: string;

  @IsOptional()
  @IsString()
  pk_xsBill: string;

  @IsOptional()
  @IsString()
  pk_recipe?: string;

  @IsNotEmpty()
  @IsNumber()
  qty!: number;

  @IsOptional()
  @IsInt()
  itemno?: number;

  @IsOptional()
  @IsInt()
  itemno_now?: number;

  @IsOptional()
  @IsNumber()
  each_qty?: number;

  @IsOptional()
  @IsDateString()
  oper_date?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsString()
  oper?: string;

  @IsOptional()
  @IsBoolean()
  bprint?: boolean;

  @IsNotEmpty()
  @IsString()
  driver!: string;

  @IsNotEmpty()
  @IsString()
  cheno!: string;

  @IsOptional()
  @IsDateString()
  prddate?: string;

  @IsOptional()
  @IsString()
  acode?: string;

  @IsOptional()
  @IsString()
  addr?: string;

  @IsOptional()
  @IsNumber()
  addr_distance?: number;

  @IsOptional()
  @IsString()
  telphone?: string;

  @IsOptional()
  @IsString()
  recipe_title?: string;

  @IsOptional()
  @IsString()
  lqprojectname?: string;

  @IsOptional()
  @IsString()
  lqbatchNo?: string;

  @IsOptional()
  @IsNumber()
  lqqty?: number;

  @IsOptional()
  @IsNumber()
  wdcl?: number;

  @IsOptional()
  @IsNumber()
  wdyq?: number;

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

  @IsOptional()
  @IsString()
  pk_Customer?: string;

  @IsOptional()
  @IsDateString()
  begindate?: string;

  @IsOptional()
  @IsString()
  remark2?: string;

  @IsOptional()
  @IsString()
  remark3?: string;

  @IsOptional()
  @IsString()
  ProjectCmpy?: string;

  @IsOptional()
  @IsString()
  ProjectPart?: string;

  @IsOptional()
  @IsString()
  shipper?: string;

  @IsOptional()
  @IsString()
  checker?: string;

  @IsOptional()
  @IsString()
  WorkMethod?: string;

  @IsOptional()
  @IsString()
  WorkPart?: string;

  @IsOptional()
  @IsString()
  CementName?: string;

  @IsOptional()
  @IsString()
  zbv1?: string;

  @IsOptional()
  @IsString()
  zbv2?: string;

  @IsOptional()
  @IsString()
  zbv3?: string;

  @IsOptional()
  @IsNumber()
  zbf1?: number;

  @IsOptional()
  @IsNumber()
  zbf2?: number;

  @IsOptional()
  @IsNumber()
  zbf3?: number;

  @IsOptional()
  @IsInt()
  zbi1?: number;

  @IsOptional()
  @IsInt()
  zbi2?: number;

  @IsOptional()
  @IsInt()
  zbi3?: number;

  @IsOptional()
  @IsBoolean()
  zbb1?: boolean;

  @IsOptional()
  @IsBoolean()
  zbb2?: boolean;

  @IsOptional()
  @IsBoolean()
  zbb3?: boolean;

  @IsOptional()
  @IsBoolean()
  bautobell?: boolean;

  @IsOptional()
  @IsNumber()
  qty_now?: number;

  @IsOptional()
  @IsInt()
  qty_che?: number;
}

export class UpdatePrdbillDto extends PartialType(CreatePrdbillDto) {}
