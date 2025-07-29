import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Decimal } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";
import { CreateXsbillDto, UpdateXsbillDto } from "./dtos";

@Injectable()
export class MixPlantService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async getAllXSCustomers() {
    const customers = await this.prisma.xscustomer.findMany();
    return customers.map((c) => ({
      ...c,
      addr_distance:
        c.addr_distance instanceof Decimal
          ? c.addr_distance.toNumber()
          : c.addr_distance,
    }));
  }

  async registerXSCustomer(dto: any) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto;
    let pk = origPk;
    let pxxh = origPxxh;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      // Get the current max pxxh
      const last = await this.prisma.xscustomer.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? last.pxxh + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    return this.prisma.xscustomer.create({ data: { pk, pxxh, ...data } });
  }

  async updateXSCustomer(pk: string, dto: any) {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) dto[key] = undefined;
    });
    return this.prisma.xscustomer.update({ where: { pk }, data: dto });
  }

  async getAllBasstorage() {
    const items = await this.prisma.basstorage.findMany();
    return items.map((item) => ({
      ...item,
      QtyRecipe:
        item.QtyRecipe instanceof Decimal
          ? item.QtyRecipe.toNumber()
          : item.QtyRecipe,
      QtyCoarse:
        item.QtyCoarse instanceof Decimal
          ? item.QtyCoarse.toNumber()
          : item.QtyCoarse,
      QtySlow:
        item.QtySlow instanceof Decimal
          ? item.QtySlow.toNumber()
          : item.QtySlow,
      QtyFinal:
        item.QtyFinal instanceof Decimal
          ? item.QtyFinal.toNumber()
          : item.QtyFinal,
      QtyActual:
        item.QtyActual instanceof Decimal
          ? item.QtyActual.toNumber()
          : item.QtyActual,
      Qtyhsl:
        item.Qtyhsl instanceof Decimal ? item.Qtyhsl.toNumber() : item.Qtyhsl,
      Inventory:
        item.Inventory instanceof Decimal
          ? item.Inventory.toNumber()
          : item.Inventory,
      Absorption:
        item.Absorption instanceof Decimal
          ? item.Absorption.toNumber()
          : item.Absorption,
      RateCC:
        item.RateCC instanceof Decimal ? item.RateCC.toNumber() : item.RateCC,
    }));
  }

  async getBasstorageByPk(pk: string) {
    const item = await this.prisma.basstorage.findUnique({ where: { pk } });
    if (!item) return null;
    return {
      ...item,
      QtyRecipe:
        item.QtyRecipe instanceof Decimal
          ? item.QtyRecipe.toNumber()
          : item.QtyRecipe,
      QtyCoarse:
        item.QtyCoarse instanceof Decimal
          ? item.QtyCoarse.toNumber()
          : item.QtyCoarse,
      QtySlow:
        item.QtySlow instanceof Decimal
          ? item.QtySlow.toNumber()
          : item.QtySlow,
      QtyFinal:
        item.QtyFinal instanceof Decimal
          ? item.QtyFinal.toNumber()
          : item.QtyFinal,
      QtyActual:
        item.QtyActual instanceof Decimal
          ? item.QtyActual.toNumber()
          : item.QtyActual,
      Qtyhsl:
        item.Qtyhsl instanceof Decimal ? item.Qtyhsl.toNumber() : item.Qtyhsl,
      Inventory:
        item.Inventory instanceof Decimal
          ? item.Inventory.toNumber()
          : item.Inventory,
      Absorption:
        item.Absorption instanceof Decimal
          ? item.Absorption.toNumber()
          : item.Absorption,
      RateCC:
        item.RateCC instanceof Decimal ? item.RateCC.toNumber() : item.RateCC,
    };
  }

  async createBasstorage(dto: any) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto;
    let pk = origPk;
    let pxxh = origPxxh;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      const last = await this.prisma.basstorage.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? last.pxxh + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    return this.prisma.basstorage.create({ data: { pk, pxxh, ...data } });
  }

  async updateBasstorage(pk: string, dto: any) {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) dto[key] = undefined;
    });
    return this.prisma.basstorage.update({ where: { pk }, data: dto });
  }

  async deleteBasstorage(pk: string) {
    return this.prisma.basstorage.delete({ where: { pk } });
  }

  // BASRECIPE CRUD
  async getAllBasrecipe() {
    const items = await this.prisma.basrecipe.findMany();
    return items.map((item) => ({
      ...item,
      lqtotal:
        item.lqtotal instanceof Decimal
          ? item.lqtotal.toNumber()
          : item.lqtotal,
      fjj1_0:
        item.fjj1_0 instanceof Decimal ? item.fjj1_0.toNumber() : item.fjj1_0,
      fjj1_1:
        item.fjj1_1 instanceof Decimal ? item.fjj1_1.toNumber() : item.fjj1_1,
      fjj1_2:
        item.fjj1_2 instanceof Decimal ? item.fjj1_2.toNumber() : item.fjj1_2,
      fjj1_3:
        item.fjj1_3 instanceof Decimal ? item.fjj1_3.toNumber() : item.fjj1_3,
      fjj1_4:
        item.fjj1_4 instanceof Decimal ? item.fjj1_4.toNumber() : item.fjj1_4,
      fjj1_5:
        item.fjj1_5 instanceof Decimal ? item.fjj1_5.toNumber() : item.fjj1_5,
      fjj1_6:
        item.fjj1_6 instanceof Decimal ? item.fjj1_6.toNumber() : item.fjj1_6,
      fjj1_7:
        item.fjj1_7 instanceof Decimal ? item.fjj1_7.toNumber() : item.fjj1_7,
      sjb: item.sjb instanceof Decimal ? item.sjb.toNumber() : item.sjb,
      sl: item.sl instanceof Decimal ? item.sl.toNumber() : item.sl,
      bgmd: item.bgmd instanceof Decimal ? item.bgmd.toNumber() : item.bgmd,
      OnOrder:
        item.OnOrder instanceof Decimal
          ? item.OnOrder.toNumber()
          : item.OnOrder,
    }));
  }

  async getBasrecipeByPk(pk: string) {
    const item = await this.prisma.basrecipe.findUnique({ where: { pk } });
    if (!item) return null;
    return {
      ...item,
      lqtotal:
        item.lqtotal instanceof Decimal
          ? item.lqtotal.toNumber()
          : item.lqtotal,
      fjj1_0:
        item.fjj1_0 instanceof Decimal ? item.fjj1_0.toNumber() : item.fjj1_0,
      fjj1_1:
        item.fjj1_1 instanceof Decimal ? item.fjj1_1.toNumber() : item.fjj1_1,
      fjj1_2:
        item.fjj1_2 instanceof Decimal ? item.fjj1_2.toNumber() : item.fjj1_2,
      fjj1_3:
        item.fjj1_3 instanceof Decimal ? item.fjj1_3.toNumber() : item.fjj1_3,
      fjj1_4:
        item.fjj1_4 instanceof Decimal ? item.fjj1_4.toNumber() : item.fjj1_4,
      fjj1_5:
        item.fjj1_5 instanceof Decimal ? item.fjj1_5.toNumber() : item.fjj1_5,
      fjj1_6:
        item.fjj1_6 instanceof Decimal ? item.fjj1_6.toNumber() : item.fjj1_6,
      fjj1_7:
        item.fjj1_7 instanceof Decimal ? item.fjj1_7.toNumber() : item.fjj1_7,
      sjb: item.sjb instanceof Decimal ? item.sjb.toNumber() : item.sjb,
      sl: item.sl instanceof Decimal ? item.sl.toNumber() : item.sl,
      bgmd: item.bgmd instanceof Decimal ? item.bgmd.toNumber() : item.bgmd,
      OnOrder:
        item.OnOrder instanceof Decimal
          ? item.OnOrder.toNumber()
          : item.OnOrder,
    };
  }

  async createBasrecipe(dto: any) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto;
    let pk = origPk;
    let pxxh = origPxxh;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      const last = await this.prisma.basrecipe.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? last.pxxh + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    return this.prisma.basrecipe.create({ data: { pk, pxxh, ...data } });
  }

  async updateBasrecipe(pk: string, dto: any) {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) dto[key] = undefined;
    });
    return this.prisma.basrecipe.update({ where: { pk }, data: dto });
  }

  async deleteBasrecipe(pk: string) {
    return this.prisma.basrecipe.delete({ where: { pk } });
  }

  // BASRECIPE_D CRUD (with relations)
  async getAllBasrecipeD() {
    const items = await this.prisma.basrecipe_d.findMany();
    return items.map((item) => ({
      ...item,
      qty: item.qty instanceof Decimal ? item.qty.toNumber() : item.qty,
    }));
  }

  async getBasrecipeDByPk(pk: string) {
    const item = await this.prisma.basrecipe_d.findUnique({
      where: { pk },
    });
    if (!item) return null;
    return {
      ...item,
      qty: item.qty instanceof Decimal ? item.qty.toNumber() : item.qty,
    };
  }

  async createBasrecipeD(dto: any) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto;
    let pk = origPk;
    let pxxh = origPxxh;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      const last = await this.prisma.basrecipe_d.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? last.pxxh + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    return this.prisma.basrecipe_d.create({ data: { pk, pxxh, ...data } });
  }

  async updateBasrecipeD(pk: string, dto: any) {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) dto[key] = undefined;
    });
    return this.prisma.basrecipe_d.update({ where: { pk }, data: dto });
  }

  async deleteBasrecipeD(pk: string) {
    return this.prisma.basrecipe_d.delete({ where: { pk } });
  }

  // XSBILL (Order) CRUD
  async getAllXsbill() {
    const items = await this.prisma.xsbill.findMany();
    return items.map((item) => this._xsbillToResponse(item));
  }

  async getXsbillByPk(pk: string) {
    const item = await this.prisma.xsbill.findUnique({ where: { pk } });
    if (!item) return null;
    return this._xsbillToResponse(item);
  }

  async createXsbill(dto: CreateXsbillDto) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto;
    let pk = origPk;
    let pxxh = origPxxh;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      const last = await this.prisma.xsbill.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? last.pxxh + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    const created = await this.prisma.xsbill.create({
      data: { pk, pxxh, ...data },
    });
    return this._xsbillToResponse(created);
  }

  async updateXsbill(pk: string, dto: UpdateXsbillDto) {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) dto[key] = undefined;
    });
    const updated = await this.prisma.xsbill.update({
      where: { pk },
      data: dto,
    });
    return this._xsbillToResponse(updated);
  }

  async deleteXsbill(pk: string) {
    return this.prisma.xsbill.delete({ where: { pk } });
  }

  private _xsbillToResponse(item: any) {
    // Convert decimals to numbers and dates to ISO strings
    const decimalFields = [
      "qty",
      "qty_now",
      "price",
      "zbf1",
      "zbf2",
      "zbf3",
      "water_adj",
    ];
    const intFields = ["pxxh", "status", "qty_che", "zbi1", "zbi2", "zbi3"];
    const boolFields = ["zbb1", "zbb2", "zbb3", "bautobell"];
    const dateFields = ["oper_date"];
    const result: any = { ...item };
    decimalFields.forEach((f) => {
      if (result[f] && typeof result[f].toNumber === "function") {
        result[f] = result[f].toNumber();
      }
    });
    intFields.forEach((f) => {
      if (result[f] != null) result[f] = Number(result[f]);
    });
    boolFields.forEach((f) => {
      if (result[f] != null) result[f] = Boolean(result[f]);
    });
    dateFields.forEach((f) => {
      if (result[f] instanceof Date) result[f] = result[f].toISOString();
    });
    return result;
  }
}
