import { PartialType } from "@nestjs/mapped-types";
import { BasrecipeCreateDto } from "./basrecipe-create.dto";

export class BasrecipeUpdateDto extends PartialType(BasrecipeCreateDto) {}
