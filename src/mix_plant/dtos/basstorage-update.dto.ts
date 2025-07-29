import { PartialType } from "@nestjs/mapped-types";
import { BasstorageCreateDto } from "./basstorage-create.dto";

export class BasstorageUpdateDto extends PartialType(BasstorageCreateDto) {}
