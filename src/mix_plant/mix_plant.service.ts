import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Decimal } from "@prisma/client/runtime/library";
import { v4 as uuidv4 } from "uuid";
import axios from "../http_client";
import {
  CreateXsbillDto,
  UpdateXsbillDto,
  CreatePrdbillDto,
  UpdatePrdbillDto,
} from "./dtos";

@Injectable()
export class MixPlantService {
  private readonly plantID = "6B8B7D9E-9ED5-423A-A10C-CEEE54CFB0A6";
  private readonly SYNC_URL = "https://app-api.decentgroups.com";
  // private readonly SYNC_URL = "http://localhost:5000";
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

  async getUnsyncedPrdbills(take = 10) {
    const synced_data = await axios.request({
      method: "GET",
      url: `${this.SYNC_URL}/api/schedule/delivery/synced?voucherDefinition=131`,
      headers: {
        "Content-Type": "application/json",
        "X-From-Sync": "true",
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });
    // Extract just the codes from the API response
    const syncedCodes = synced_data.data.map((item) => item.code);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    // Query unsynced PRS bills
    return this.prisma.prdbill_his.findMany({
      where: {
        pk_xsBill: {
          startsWith: "PRS",
        },
        pk: {
          notIn: syncedCodes.length ? syncedCodes : ["_none_"], // avoids empty array error
        },
        oper_date: {
          gte: ninetyDaysAgo, // only include last 90 days
        },
      },
      take,
    });
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
    return this.prisma.xscustomer.create({
      data: {
        pk,
        pxxh,
        pk_station: this.plantID,
        oper_date: new Date().toISOString(),
        //station for plant one
        ...data,
      },
    });
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
    return this.prisma.basstorage.create({
      data: { pk, pk_station: this.plantID, pxxh, ...data },
    });
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
    return this.prisma.basrecipe.create({
      data: {
        pk,
        pk_station: this.plantID,
        pxxh,
        ...data,
        oper_date: new Date().toISOString(),
      },
    });
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
      data: {
        pk,
        pxxh,
        pk_station: this.plantID,
        oper_date: new Date().toISOString(),
        ...data,
      },
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

  // PRDBILL (Production) create/update
  async createPrdbill(dto: CreatePrdbillDto) {
    const { pk: origPk, pxxh: origPxxh, ...data } = dto as any;
    let pk = origPk;
    let pxxh = origPxxh as number | undefined | null;
    if (!pk) {
      pk = uuidv4();
    }
    if (pxxh === undefined || pxxh === null) {
      const last = await this.prisma.prdbill.findFirst({
        orderBy: { pxxh: "desc" },
        select: { pxxh: true },
      });
      pxxh = last?.pxxh != null ? (last.pxxh as number) + 1 : 1;
    }
    Object.keys(data).forEach((key) => {
      if ((data as any)[key] === null) (data as any)[key] = undefined;
    });
    const created = await this.prisma.prdbill.create({
      data: { pk, pxxh, ...data },
    });
    return this._prdbillToResponse(created);
  }

  async updatePrdbill(pk: string, dto: UpdatePrdbillDto) {
    const data: any = { ...dto };
    Object.keys(data).forEach((key) => {
      if (data[key] === null) data[key] = undefined;
    });
    const updated = await this.prisma.prdbill.update({ where: { pk }, data });
    return this._prdbillToResponse(updated);
  }

  private _prdbillToResponse(item: any) {
    const decimalFields = [
      "qty",
      "each_qty",
      "addr_distance",
      "lqqty",
      "wdcl",
      "wdyq",
      "fjj1_0",
      "fjj1_1",
      "fjj1_2",
      "fjj1_3",
      "fjj1_4",
      "fjj1_0_copy1",
      "fjj1_6",
      "fjj1_7",
      "sjb",
      "sl",
      "bgmd",
      "OnOrder",
      "zbf1",
      "zbf2",
      "zbf3",
      "qty_now",
    ];
    const intFields = [
      "pxxh",
      "itemno",
      "itemno_now",
      "status",
      "zbi1",
      "zbi2",
      "zbi3",
      "qty_che",
    ];
    const boolFields = ["bprint", "zbb1", "zbb2", "zbb3", "bautobell"];
    const dateFields = ["oper_date", "prddate", "begindate"];
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
