import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsDateString,
} from "class-validator";

export class BasstorageCreateDto {
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
  pk_can?: string;

  @IsOptional()
  @IsString()
  Materialtitle?: string;

  @IsOptional()
  @IsString()
  Materialkind?: string;

  @IsOptional()
  @IsString()
  MaterialVersion?: string;

  @IsOptional()
  @IsInt()
  Discharge?: number;

  @IsOptional()
  @IsNumber()
  QtyRecipe?: number;

  @IsOptional()
  @IsNumber()
  QtyCoarse?: number;

  @IsOptional()
  @IsNumber()
  QtySlow?: number;

  @IsOptional()
  @IsNumber()
  QtyFinal?: number;

  @IsOptional()
  @IsNumber()
  QtyActual?: number;

  @IsOptional()
  @IsString()
  QtyFormat?: string;

  @IsOptional()
  @IsInt()
  FallOrder?: number;

  @IsOptional()
  @IsInt()
  DelayCheck?: number;

  @IsOptional()
  @IsDateString()
  oper_date?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  oldpk?: string;

  @IsOptional()
  @IsString()
  oper?: string;

  @IsOptional()
  @IsInt()
  status?: number;

  @IsOptional()
  @IsNumber()
  RateCC?: number;

  @IsOptional()
  @IsInt()
  StopAdd?: number;

  @IsOptional()
  @IsInt()
  StopIndex?: number;

  @IsOptional()
  @IsInt()
  lq_final_read?: number;

  @IsOptional()
  @IsInt()
  lq_final_write?: number;

  @IsOptional()
  @IsInt()
  lq_actual_read?: number;

  @IsOptional()
  @IsInt()
  lq_Slow_read?: number;

  @IsOptional()
  @IsInt()
  lq_Coarse_read?: number;

  @IsOptional()
  @IsInt()
  lq_mdong_read?: number;

  @IsOptional()
  @IsInt()
  lq_errpl_read?: number;

  @IsOptional()
  @IsInt()
  errpl?: number;

  @IsOptional()
  @IsInt()
  lq_gljc2_read?: number;

  @IsOptional()
  @IsInt()
  gljc2?: number;

  @IsOptional()
  @IsInt()
  lq_glmd2_read?: number;

  @IsOptional()
  @IsInt()
  glmd2?: number;

  @IsOptional()
  @IsInt()
  Coarseb?: number;

  @IsOptional()
  @IsInt()
  CoarsebAddr?: number;

  @IsOptional()
  @IsInt()
  CoarsebIndex?: number;

  @IsOptional()
  @IsInt()
  plSpan?: number;

  @IsOptional()
  @IsInt()
  plSpanAddr?: number;

  @IsOptional()
  @IsInt()
  DelayCheckAddr?: number;

  @IsOptional()
  @IsInt()
  FallOrderAddr?: number;

  @IsOptional()
  @IsNumber()
  Qtyhsl?: number;

  @IsOptional()
  @IsInt()
  DisplayOrder?: number;

  @IsOptional()
  @IsNumber()
  Inventory?: number;

  @IsOptional()
  @IsNumber()
  Absorption?: number;
}
