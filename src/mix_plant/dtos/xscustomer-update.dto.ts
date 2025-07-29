import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsEmail,
  IsDateString,
} from "class-validator";

export class XSCustomerUpdateDto {
  @IsOptional()
  @IsString()
  pk_station?: string;

  @IsOptional()
  @IsString()
  title?: string;

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
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  recipe_last?: string;

  @IsOptional()
  @IsString()
  driver_last?: string;

  @IsOptional()
  @IsString()
  truck_last?: string;

  @IsOptional()
  @IsDateString()
  sale_last?: string;

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
  @IsInt()
  status?: number;
}
