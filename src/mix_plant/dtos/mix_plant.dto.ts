import { IsNotEmpty, IsString } from "class-validator";

export class ClientKeyDto {}

export class ClientKeyResponseDto {
  clientId: string;
  clientSecret: string;
  constructor(partial: Partial<ClientKeyResponseDto>) {
    Object.assign(this, partial);
  }
}

export class TokenDto {
  /**
   * user clientId
   * @example eccbc49203b490a306fa1d44ae7b3ee3
   */
  @IsNotEmpty()
  @IsString()
  clientId: string;

  /**
   * user clientSecret
   * @example 903e5c0f1e51057df8f3111289d7b1c6cd48e38188c4502b50770ecdf7e140fb
   */
  @IsNotEmpty()
  @IsString()
  clientSecret: string;
}

export class TokenResponseDto {
  token: string;
  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial);
  }
}

export class VerifyTokenDto {
  /**
   * user token
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImVjY2JjNDkyMDNiNDkwYTMwNmZhMWQ0NGFlN2IzZWUzIiwiaWF0IjoxNzA5MDE5OTY2LCJleHAiOjE3MDkxMDYzNjZ9.TqCaVGrizUrgXdrQPdLLHVDqG2h3csciHznvKfsL_7c
   */
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class VerifyTokenResponseDto {
  status: boolean;
  constructor(partial: Partial<VerifyTokenResponseDto>) {
    Object.assign(this, partial);
  }
}
