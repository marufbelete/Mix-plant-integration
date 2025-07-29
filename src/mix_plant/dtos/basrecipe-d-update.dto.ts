import { PartialType } from "@nestjs/mapped-types";
import { BasrecipeDCreateDto } from "./basrecipe-d-create.dto";

export class BasrecipeDUpdateDto extends PartialType(BasrecipeDCreateDto) {}
