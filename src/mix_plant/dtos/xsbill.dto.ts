import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class CreateXsbillDto {
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
  pk_Customer?: string;

  @IsOptional()
  @IsString()
  pk_recipe?: string;

  @IsOptional()
  @IsNumber()
  qty?: number;

  @IsOptional()
  @IsNumber()
  qty_now?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDateString()
  oper_date?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  oper?: string;

  @IsOptional()
  @IsString()
  acode?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsString()
  lqprojectname1?: string;

  @IsOptional()
  @IsInt()
  qty_che?: number;

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
  @IsString()
  ProjectCmpy?: string;

  @IsOptional()
  @IsString()
  ProjectPart?: string;

  @IsOptional()
  @IsString()
  tld?: string;

  @IsOptional()
  @IsString()
  WorkPart?: string;

  @IsOptional()
  @IsString()
  shipper?: string;

  @IsOptional()
  @IsNumber()
  water_adj?: number;

  @IsOptional()
  @IsString()
  WorkMethod?: string;
}

export class UpdateXsbillDto extends CreateXsbillDto {}

export class XsbillResponseDto extends CreateXsbillDto {
  // All fields as in CreateXsbillDto, but can add transformation logic if needed
}
