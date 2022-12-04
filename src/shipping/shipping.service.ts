import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { ShippingConfig } from 'src/common/configs/config.interface';
import { Coordinates } from 'src/common/models/coordinates.model';
import { ShippingOfficesResponseItem } from './dto/offices.dto';
import { ShippingOffice } from './models/offices.model';

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
}
