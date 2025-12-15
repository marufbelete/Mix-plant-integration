import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MixPlantService } from "./mix_plant.service";
import {
  XSCustomerRegisterDto,
  XSCustomerUpdateDto,
  BasstorageCreateDto,
  BasstorageUpdateDto,
  BasrecipeCreateDto,
  BasrecipeUpdateDto,
  BasrecipeDCreateDto,
  BasrecipeDUpdateDto,
  CreateXsbillDto,
  UpdateXsbillDto,
  CreatePrdbillDto,
  UpdatePrdbillDto,
} from "./dtos";

@Controller("mix_plant")
@ApiTags("mix_plant")
export class MixPlantController {
  constructor(private mixPlantService: MixPlantService) {}

  // @HttpCode(HttpStatus.CREATED)
  // @Post('key')
  // async getClientKeys(): Promise<ClientKeyResponseDto> {
  //   const result = await this.mixPlantService.getClientSecretAndId();
  //   return new ClientKeyResponseDto(result);
  // }

  @Get("xscustomer")
  async getAllXSCustomers() {
    return this.mixPlantService.getAllXSCustomers();
  }

  @Post("xscustomer")
  async registerXSCustomer(@Body() dto: XSCustomerRegisterDto) {
    return this.mixPlantService.registerXSCustomer(dto);
  }

  @Put("xscustomer/:pk")
  async updateXSCustomer(
    @Param("pk") pk: string,
    @Body() dto: XSCustomerUpdateDto
  ) {
    return this.mixPlantService.updateXSCustomer(pk, dto);
  }

  @Get("basstorage")
  async getAllBasstorage() {
    return this.mixPlantService.getAllBasstorage();
  }

  @Get("basstorage/:pk")
  async getBasstorageByPk(@Param("pk") pk: string) {
    return this.mixPlantService.getBasstorageByPk(pk);
  }

  @Post("basstorage")
  async createBasstorage(@Body() dto: BasstorageCreateDto) {
    return this.mixPlantService.createBasstorage(dto);
  }

  @Put("basstorage/:pk")
  async updateBasstorage(
    @Param("pk") pk: string,
    @Body() dto: BasstorageUpdateDto
  ) {
    return this.mixPlantService.updateBasstorage(pk, dto);
  }

  @Delete("basstorage/:pk")
  async deleteBasstorage(@Param("pk") pk: string) {
    return this.mixPlantService.deleteBasstorage(pk);
  }

  // BASRECIPE CRUD
  @Get("basrecipe")
  async getAllBasrecipe() {
    return this.mixPlantService.getAllBasrecipe();
  }

  @Get("basrecipe/:pk")
  async getBasrecipeByPk(@Param("pk") pk: string) {
    return this.mixPlantService.getBasrecipeByPk(pk);
  }

  @Post("basrecipe")
  async createBasrecipe(@Body() dto: BasrecipeCreateDto) {
    return this.mixPlantService.createBasrecipe(dto);
  }

  @Put("basrecipe/:pk")
  async updateBasrecipe(
    @Param("pk") pk: string,
    @Body() dto: BasrecipeUpdateDto
  ) {
    return this.mixPlantService.updateBasrecipe(pk, dto);
  }

  @Delete("basrecipe/:pk")
  async deleteBasrecipe(@Param("pk") pk: string) {
    return this.mixPlantService.deleteBasrecipe(pk);
  }

  // BASRECIPE_D CRUD (with relations)
  @Get("basrecipe_d")
  async getAllBasrecipeD() {
    return this.mixPlantService.getAllBasrecipeD();
  }

  @Get("basrecipe_d/:pk")
  async getBasrecipeDByPk(@Param("pk") pk: string) {
    return this.mixPlantService.getBasrecipeDByPk(pk);
  }

  @Post("basrecipe_d")
  async createBasrecipeD(@Body() dto: BasrecipeDCreateDto) {
    return this.mixPlantService.createBasrecipeD(dto);
  }

  @Put("basrecipe_d/:pk")
  async updateBasrecipeD(
    @Param("pk") pk: string,
    @Body() dto: BasrecipeDUpdateDto
  ) {
    return this.mixPlantService.updateBasrecipeD(pk, dto);
  }

  @Delete("basrecipe_d/:pk")
  async deleteBasrecipeD(@Param("pk") pk: string) {
    return this.mixPlantService.deleteBasrecipeD(pk);
  }

  // XSBILL (Order) CRUD
  @Get("xsbill")
  getAllXsbill() {
    return this.mixPlantService.getAllXsbill();
  }

  @Get("xsbill/:pk")
  getXsbillByPk(@Param("pk") pk: string) {
    return this.mixPlantService.getXsbillByPk(pk);
  }

  @Post("xsbill")
  createXsbill(@Body() dto: CreateXsbillDto) {
    return this.mixPlantService.createXsbill(dto);
  }

  @Put("xsbill/:pk")
  updateXsbill(@Param("pk") pk: string, @Body() dto: UpdateXsbillDto) {
    return this.mixPlantService.updateXsbill(pk, dto);
  }

  @Delete("xsbill/:pk")
  deleteXsbill(@Param("pk") pk: string) {
    return this.mixPlantService.deleteXsbill(pk);
  }

  // PRDBILL create/update
  @Post("prdbill")
  createPrdbill(@Body() dto: CreatePrdbillDto) {
    return this.mixPlantService.createPrdbill(dto);
  }

  @Put("prdbill/:pk")
  updatePrdbill(@Param("pk") pk: string, @Body() dto: UpdatePrdbillDto) {
    return this.mixPlantService.updatePrdbill(pk, dto);
  }
}
