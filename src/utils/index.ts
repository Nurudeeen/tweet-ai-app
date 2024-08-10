import { config } from 'dotenv'
import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

config()
class ResponseHandler{
  status: boolean;
  statusCode: number;
  message: string;
  data: any;
  constructor(status: boolean, statusCode: number, message: string, data: any) {
      this.status = status;
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
  }
}

const responseHandler = (data: ResponseHandler) => {
  return {
      ...data
  }
}


@Injectable()
class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ){}

    saveToCache = async (body: any, id: any, exp?: number) => {
        let expiredAt = exp?exp:86400
        await this.cacheManager.set(id.toString(), body, expiredAt)
    }

    getFromCache = async (id: any): Promise<any> => {
        return await this.cacheManager.get<{name: string}>(id.toString())
    }

    deleteFromCache = async (id: any) => {
        await this.cacheManager.del(id.toString())
    }

}


export{
    responseHandler,
    CacheService,
    ResponseHandler
}
