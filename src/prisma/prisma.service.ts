import { PrismaClient } from ".prisma/client";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // url: config.get<string>("DATABASE_URL"),
          url: "mysql://root:123456@localhost:3306/plantb",
          // url: "mysql://root:sanyjbz@192.168.1.10:3306/gjjbz",
          // url: "mysql://root:sanyjbz@DESKTOP-MIKFAO7:3306/gjjbz",
          // url: "mysql://root:sanyjbz@192.168.1.10:3306/jbz",
          // url: "mysql://root:sanyjbz@DESKTOP-MIKFAO8:3306/jbz",
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
