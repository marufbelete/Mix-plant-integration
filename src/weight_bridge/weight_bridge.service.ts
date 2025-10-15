// // src/weight_bridge/weight_bridge.service.ts
// import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
// import { SerialPort } from "serialport";
// import { ReadlineParser } from "@serialport/parser-readline";
// import { WeightBridgeConfigDto } from "./dto/weight-bridge-config.dto";

// @Injectable()
// export class WeightBridgeService implements OnModuleInit {
//   private port: SerialPort;
//   private parser: ReadlineParser;
//   private readonly logger = new Logger(WeightBridgeService.name);
//   private currentWeight: number | null = null;
//   private dataBuffer: string = "";
//   private config: WeightBridgeConfigDto = {
//     port: "COM4",
//     baudRate: 9600,
//     dataBits: 8,
//     parity: "none",
//     stopBits: 1,
//     protocolMode: "TF0",
//   };

//   constructor() {
//     console.log("WeightBridgeService constructor called");
//   }

//   async onModuleInit() {
//     console.log("WeightBridgeService onModuleInit STARTED");
//     this.logger.log("WeightBridgeService initializing...");
//     await this.initializeSerial();
//     this.logger.log("WeightBridgeService initialized");
//     console.log("WeightBridgeService onModuleInit COMPLETED");
//   }

//   async updateConfig(config: WeightBridgeConfigDto) {
//     this.logger.log(`Updating config: ${JSON.stringify(config)}`);
//     this.config = config;
//     await this.reinitializeSerial();
//   }

//   private async reinitializeSerial() {
//     if (this.port && this.port.isOpen) {
//       this.logger.log("Closing existing port connection");
//       await new Promise((resolve) => this.port.close(resolve));
//     }
//     await this.initializeSerial();
//   }

//   private async initializeSerial() {
//     try {
//       this.logger.log(`Initializing serial connection to ${this.config.port}`);
      
//       // Check if port exists
//       const ports = await SerialPort.list();
//       const portExists = ports.find((p) => p.path === this.config.port);
//       if (!portExists) {
//         this.logger.error(
//           `Port ${this.config.port} not found. Available ports:`,
//           ports.map((p) => p.path)
//         );
//         return;
//       }
      
//       this.port = new SerialPort({
//         path: this.config.port,
//         baudRate: this.config.baudRate,
//         dataBits: this.config.dataBits,
//         parity: this.config.parity,
//         stopBits: this.config.stopBits,
//         autoOpen: true,
//       });
      
//       this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
      
//       // Listen for raw data events to see if anything is coming through
//       this.port.on("data", (chunk) => {
//         const data = chunk.toString();
//         this.dataBuffer += data;
//         this.logger.log(`Raw data received: "${data}" | Buffer: "${this.dataBuffer}"`);
        
//         // Check if we have a complete message (contains ETX 03)
//         if (this.dataBuffer.includes('\x03')) {
//           this.parseCompleteMessage(this.dataBuffer);
//           this.dataBuffer = ""; // Reset buffer
//         }
//       });
      
//       this.port.on("open", () => {
//         this.logger.log(`Connected to ${this.config.port}`);
//       });
      
//       this.port.on("close", () => {
//         this.logger.log(`Port ${this.config.port} closed`);
//       });
      
//       this.parser.on("data", (data: string) => {
//         this.logger.log(`Parser received data: "${data}"`);
//         this.currentWeight = this.parseData(data);
//         this.logger.debug(`Received weight: ${this.currentWeight}`);
//       });
      
//       // Try alternative parser with different delimiter
//       const altParser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));
//       altParser.on("data", (data: string) => {
//         this.logger.log(`Alt parser received data: "${data}"`);
//         this.currentWeight = this.parseData(data);
//         this.logger.debug(`Alt parser weight: ${this.currentWeight}`);
//       });
      
//       this.port.on("error", (err) => {
//         this.logger.error("Serial error:", err.message);
//       });
      
//     } catch (error) {
//       this.logger.error("Initialization error:", error);
//     }
//   }

//   private parseCompleteMessage(buffer: string) {
//     this.logger.log(`Parsing complete message: "${buffer}"`);
    
//     // Look for pattern: +00XXX1E (where XXX is the weight)
//     const match = buffer.match(/\+00(\d+)1E/);
//     if (match) {
//       const weightStr = match[1];
//       const weight = parseFloat(weightStr) / 10; // Convert to kg (500 -> 50.0 kg)
//       this.currentWeight = weight;
//       this.logger.log(`Parsed weight: ${weight} kg from "${weightStr}"`);
//     } else {
//       this.logger.log(`No weight pattern found in: "${buffer}"`);
//     }
//   }

//   private parseData(data: string): number | null {
//     this.logger.debug(`Raw data: "${data}", length: ${data.length}, protocol: ${this.config.protocolMode}`);
    
//     // Protocol TF=0 (12-byte ASCII frame)
//     if (this.config.protocolMode === "TF0" && data.length >= 12) {
//       this.logger.debug(`Parsing TF0: sign=${data[1]}, integer=${data.slice(2, 6)}, decimal=${data.slice(6, 8)}`);
//       const sign = data[1] === "-" ? -1 : 1;
//       const integerPart = data.slice(2, 6).trim();
//       const decimalPart = data.slice(6, 8).trim();
//       const result = sign * parseFloat(`${integerPart}.${decimalPart}`);
//       this.logger.debug(`TF0 parsed result: ${result}`);
//       return result;
//     } else if (["TF2", "TF3"].includes(this.config.protocolMode)) {
//       this.logger.debug(`Parsing TF2/TF3: data="${data}"`);
//       const weightStr = data.split("=")[0];
//       const result = parseFloat(weightStr);
//       this.logger.debug(`TF2/TF3 parsed result: ${result}`);
//       return result;
//     }
//     this.logger.debug(`No protocol matched, returning null`);
//     return null;
//   }

//   getCurrentWeight(): number | null {
//     this.logger.log(`getCurrentWeight called, current weight: ${this.currentWeight}`);
//     return this.currentWeight;
//   }

//   isConnected(): boolean {
//     return this.port?.isOpen || false;
//   }

//   getConnectionStatus() {
//     return {
//       connected: this.isConnected(),
//       port: this.config.port,
//       currentWeight: this.currentWeight
//     };
//   }
// }
