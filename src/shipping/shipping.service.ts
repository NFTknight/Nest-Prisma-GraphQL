import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { ShippingConfig } from 'src/common/configs/config.interface';
import { Coordinates } from 'src/common/models/coordinates.model';
import { CreateShipmentInput } from 'src/orders/dto/update-order.input';
import { ShippingOfficesResponseItem } from './dto/offices.dto';
import { ShippingOffice } from './models/offices.model';
import { WayBill, WayBillItem } from './models/waybill.model';

@Injectable()
export class ShippingService {
  private readonly shippingConfig: ShippingConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.shippingConfig = this.configService.get<ShippingConfig>('shipping');
  }

  async getShippingOffices(city?: string) {
    const url = `${this.shippingConfig.url}/api/lookup/smsaoffices`;
    return firstValueFrom(
      this.httpService
        .get<ShippingOfficesResponseItem[]>(url, {
          headers: {
            apikey: this.shippingConfig.token,
          },
        })
        .pipe(
          map((res) => {
            const locations = res.data
              .filter((item) => {
                if (city) {
                  return item.cityName === city;
                }

                return true;
              })
              .map((location) => {
                const [lat, lng] = location.coordinates.split(',');
                const entity = new ShippingOffice();
                const coordinates = new Coordinates();
                coordinates.lat = parseFloat(lat) ?? 0;
                coordinates.lng = parseFloat(lng) ?? 0;

                if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
                  coordinates.lat = 0;
                  coordinates.lng = 0;
                }

                entity.code = location.code;
                entity.address = location.address;
                entity.cityName = location.cityName;
                entity.addressAR = location.addressAR;
                entity.coordinates = coordinates;
                entity.firstShift = location.firstShift;
                entity.secondShift = location.secondShift;
                entity.weekendShift = location.weekendShift;

                return entity;
              });

            return locations;
          })
        )
    );
  }

  async trackShipment(trackingNumber: string) {
    const url = `${this.shippingConfig.url}/api/shipment/b2c/query/${trackingNumber}`;
    return firstValueFrom(
      this.httpService
        .get<WayBill>(url, {
          headers: {
            apikey: this.shippingConfig.token,
          },
        })
        .pipe(
          map((res) => {
            const wayBill = new WayBill();
            wayBill.sawb = res.data.sawb;
            wayBill.createDate = res.data.createDate;
            wayBill.shipmentParcelsCount = res.data.shipmentParcelsCount;
            wayBill.waybills = res.data.waybills.map((item) => {
              const wayBillItem = new WayBillItem();
              wayBillItem.awb = item.awb;
              wayBillItem.awbFile = item.awbFile;

              return wayBillItem;
            });

            return wayBill;
          })
        )
    );
  }

  async createShipment(payload: CreateShipmentInput) {
    const url = `${process.env.SMSA_API_URL}/api/shipment/b2c/new`;
    return firstValueFrom(
      this.httpService
        .post<WayBill>(url, payload, {
          headers: {
            apikey: this.shippingConfig.token,
          },
        })
        .pipe(
          map((res) => {
            const wayBill = new WayBill();
            wayBill.sawb = res.data.sawb;
            wayBill.createDate = res.data.createDate;
            wayBill.shipmentParcelsCount = res.data.shipmentParcelsCount;
            wayBill.waybills = res.data.waybills.map((item) => {
              const wayBillItem = new WayBillItem();
              wayBillItem.awb = item.awb;
              wayBillItem.awbFile = item.awbFile;

              return wayBillItem;
            });

            return wayBill;
          })
        )
    );
  }
}
