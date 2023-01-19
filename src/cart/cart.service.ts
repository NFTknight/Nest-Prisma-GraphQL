import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Cart } from './models/cart.model';

import { CartItemInput } from './dto/cart.input';
import {
  BookingStatus,
  DeliveryMethods,
  Order,
  OrderStatus,
  PaymentMethods,
  Prisma,
  ProductType,
  Vendor,
  WayBill,
} from '@prisma/client';
import { CartItemService } from './services/cart-item.service';
import { find, omit } from 'lodash';
import { VendorsService } from 'src/vendors/vendors.service';
import { nanoid } from 'nanoid';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { ORDER_OPTIONS, SendEmails } from 'src/utils/email';
import { PaymentService } from 'src/payment/payment.service';
import { ProductsService } from 'src/products/services/products.service';
import { throwNotFoundException } from 'src/utils/validation';
import { ShippingService } from 'src/shipping/shipping.service';
import { CreateShipmentInput } from 'src/orders/dto/update-order.input';
import { getReadableDate } from 'src/utils/general';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartItemService: CartItemService,
    private readonly vendorService: VendorsService,
    private readonly emailService: SendgridService,
    private readonly shippingService: ShippingService,
    private readonly paymentService: PaymentService,
    private readonly productService: ProductsService
  ) {}

  async createNewCart(vendorId: string, customerId: string): Promise<Cart> {
    return await this.prisma.cart.create({
      data: {
        customerId,
        vendorId,
        finalPrice: 0,
        totalPrice: 0,
        items: [],
      },
    });
  }

  async getCart(cartId: string): Promise<Cart | null> {
    if (!cartId) return null;
    return await this.prisma.cart.findUnique({
      where: { id: cartId },
    });
  }

  async getCartByCustomer(customerId: string, vendorId: string): Promise<Cart> {
    try {
      const res = await this.prisma.cart.findFirst({
        where: {
          customerId: customerId.toString(),
          vendorId: vendorId.toString(),
        },
      });
      if (!res) return null;

      const cartItems = [...res.items];

      let shouldUpdateCart = false;
      let haveProductType = false;

      // logic to check if all the products in the cartItems are valid and existing
      for (const [i, item] of cartItems.entries()) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.active) {
          await this.removeItemFromCart(res.id, item.productId, item.sku);
          cartItems.splice(i, 1);
        } else {
          if (product.type === ProductType.PRODUCT) {
            haveProductType = true;
          }

          if (product.type === ProductType.SERVICE) {
            const bookings = await this.prisma.booking.findMany({
              where: { cartId: res.id, productId: product.id },
            });

            if (!bookings.length) {
              cartItems.splice(i, 1);
            }
          }

          const updatedPrice =
            product?.variants?.find((variant) => variant.sku === item.sku)
              ?.price || item.price;

          if (updatedPrice !== item.price) {
            shouldUpdateCart = true;
            cartItems[i] = {
              ...item,
              price: updatedPrice,
            };
          }
        }
      }
      //this brings the deliveryCharges
      const deliveryCharges = res.totalPrice - res.subTotal;

      //this is to make sure subTotal is correct
      const subTotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const updatedCartObject = {
        items: cartItems,
        subTotal: subTotal,
        totalPrice: subTotal + deliveryCharges,
      };
      if (!haveProductType) {
        updatedCartObject['totalPrice'] = subTotal;
        updatedCartObject['deliveryMethod'] = null;
        updatedCartObject['deliveryArea'] = null;
      }

      if (shouldUpdateCart || !haveProductType)
        await this.updateCart(res.id, updatedCartObject);

      return {
        ...res,
        //returning newly calculated subTotal + deliveryCharges as new total
        totalPrice: updatedCartObject.totalPrice,
        subTotal: updatedCartObject.subTotal,
        items: cartItems,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateCartPrice(
    cartId: string,
    prices: { totalPrice: number }
  ): Promise<Cart> {
    return await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        ...prices,
      },
    });
  }

  async addItemToCart(cartId: string, data: CartItemInput) {
    const cart = await this.getCart(cartId);

    throwNotFoundException(cart, 'Cart');

    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: data.productId },
    });

    let cartData: Prisma.CartUpdateArgs['data'] = {};

    switch (product.type) {
      case ProductType.PRODUCT:
        cartData = this.cartItemService.addProduct(product, cart, data);
        break;

      case ProductType.WORKSHOP:
        cartData = await this.cartItemService.addWorkshopToCart(
          product,
          cart,
          data
        );
        break;

      case ProductType.SERVICE:
        cartData = await this.cartItemService.addServiceToCart(
          product,
          cart,
          data
        );

      default:
        break;
    }

    return this.prisma.cart.update({
      where: { id: cartId },
      data: omit(cartData, ['id']),
    });
  }

  async removeItemFromCart(
    cartId: string,
    productId: string,
    sku: string,
    date = ''
  ) {
    const cart = await this.getCart(cartId);
    throwNotFoundException(cart, 'Cart');

    const product = await this.productService.getProduct(productId);
    let items = [];

    if (product.type === ProductType.SERVICE) {
      if (!date)
        throw new BadRequestException(
          'Date is required to remove Item of type Service'
        );
      const sameServiceItems = cart.items.filter(
        (item) => item.productId === productId && item.sku === sku
      );
      const remainingServiceItem = sameServiceItems.filter((serviceItem) => {
        return serviceItem.slots.every(
          (slot) =>
            getReadableDate(slot.from.toString()) !==
            getReadableDate(date || '')
        );
      });
      items = cart.items.filter(
        (item) => item.productId !== productId || item.sku !== sku
      );
      items = [...items, ...remainingServiceItem];
    } else {
      items = cart.items.filter(
        (item) => item.productId !== productId || item.sku !== sku
      );
    }

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items,
        totalPrice,
      },
    });
  }

  async updateCartItem(cartId: string, data: CartItemInput) {
    const cart = await this.getCart(cartId);

    throwNotFoundException(cart, 'Cart');

    const newItem = {
      ...find(cart.items, {
        productId: data.productId,
        sku: data.sku,
      }),
      ...data,
    };

    const items = cart.items.map((item) =>
      item.productId === data.productId && item.sku === data.sku
        ? newItem
        : item
    );

    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedCart = this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items,
        totalPrice,
      },
    });
    const updatedCartItem: any = await Promise.all(
      cart.items.map(async (item) => {
        const product = await this.productService.getProduct(item.productId);
        return { ...product, ...item };
      })
    );
    updatedCart.items = updatedCartItem;

    return updatedCart;
  }

  async getCartAndDelete(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (!cart) throw new BadRequestException('Cart does not exists');

    // cart deletion
    await this.prisma.cart.delete({
      where: { id: cartId },
    });

    return cart;
  }

  //this should not type any, but this was generating error on assigning it a type
  async updateCart(cartId: string, data: any) {
    return this.prisma.cart.update({
      where: { id: cartId },
      data: data,
    });
  }

  async checkoutCartAndCreateOrder(cartId: string, paymentSession?: string) {
    let payment = undefined;
    let errors = undefined;

    const cart = await this.getCart(cartId);
    throwNotFoundException(cart, 'Cart');

    // if product's quantity, workshop's noOdSeats, or service's booking are not available, throw error
    const cartErrors = await this.checkItemsAvailability(cart);
    if (cartErrors.length) {
      return {
        ...cart,
        errors: cartErrors,
      };
    }

    const isOnlinePayment = cart.paymentMethod === PaymentMethods.ONLINE;

    if (
      !cart.deliveryMethod &&
      cart?.items?.some((item) => item?.product?.type === ProductType.PRODUCT)
    ) {
      throw new BadRequestException('delivery method is required');
    } else if (!cart.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    } else if (isOnlinePayment && !paymentSession) {
      throw new BadRequestException('Payment session is required');
    }

    const { vendorId } = cart;
    const vendorPrefix = await this.vendorService.getVendorOrderPrefix(
      vendorId
    );
    const orderId = `${vendorPrefix}-${nanoid(8)}`.toUpperCase();

    const vendor = await this.vendorService.getVendor(vendorId);

    let order = await this.prisma.order.findFirst({
      where: {
        cartId,
      },
    });

    if (!order) {
      order = await this.prisma.order.create({
        data: {
          orderId,
          items: cart.items,
          customerId: cart.customerId,
          customerInfo: cart.customerInfo,
          paymentMethod: cart.paymentMethod,
          appliedCoupon: cart.appliedCoupon,
          subTotal: cart.subTotal,
          finalPrice: cart.finalPrice || cart.subTotal,
          totalPrice: cart.totalPrice,
          status: OrderStatus[isOnlinePayment ? 'CREATED' : 'PENDING'],
          ...(cart.deliveryMethod && {
            deliveryMethod: cart.deliveryMethod,
          }),
          ...(cart.consigneeAddress && {
            consigneeAddress: cart.consigneeAddress,
          }),
          ...(cart.shipperAddress && {
            shipperAddress: cart.shipperAddress,
          }),
          vendor: {
            connect: {
              id: vendorId,
            },
          },
          cart: {
            connect: {
              id: cartId,
            },
          },
        },
      });
    }

    if (isOnlinePayment) {
      try {
        payment = await this.paymentService.executePayment(
          order.id,
          paymentSession,
          vendor.slug
        );

        if (payment?.InvoiceId) {
          await this.prisma.order.update({
            where: { id: order.id },
            data: {
              invoiceId: payment.InvoiceId.toString(),
            },
          });
        }
      } catch (error) {
        errors = error.response.data.ValidationErrors;
      }
    }

    if (
      order.status === OrderStatus.PENDING &&
      order.deliveryMethod === DeliveryMethods.SMSA
    ) {
      const wayBillData = await this.createWayBillData(order, vendor);

      if (wayBillData) {
        order = await this.prisma.order.update({
          where: { id: order.id },
          data: {
            wayBill: wayBillData,
          },
        });
      }
    }

    // Payment method is not ONLINE or online payment is successfully done
    if (order.id && errors === undefined) {
      // update bookings in the cart to add order id, status for pending and remove holdTimeStamp
      await this.prisma.booking.updateMany({
        where: { cartId },
        data: {
          orderId: order.id,
          status: BookingStatus.PENDING,
          holdTimestamp: { unset: true },
          updatedAt: new Date(),
        },
      });

      // remove cart: all details are now in order
      await this.prisma.cart.delete({
        where: { id: cartId },
      });

      // decrement product's variant's quantity as order is now created
      await this.productService.decrementProductVariantQuantities(
        cart?.items || []
      );

      // Email notification to customer when order is created
      this.emailService.send(
        SendEmails(ORDER_OPTIONS.PURCHASED, order?.customerInfo?.email)
      );

      // Email notification to vendor when order is created
      if (vendor?.info?.email) {
        this.emailService.send(
          SendEmails(ORDER_OPTIONS.RECEIVED, vendor?.info?.email)
        );
      } else {
        // if vendor info doesn't have email, fetch is from user
        const user = await this.prisma.user.findUnique({
          where: { id: vendor.ownerId },
        });

        if (user)
          this.emailService.send(
            SendEmails(ORDER_OPTIONS.RECEIVED, user.email)
          );
      }
    }

    return {
      ...order,
      payment,
      errors,
    };
  }

  checkItemsAvailability = async (cart: Cart) => {
    const cartErrors = [];
    for (const item of cart.items) {
      const product = await this.productService.getProduct(item.productId);
      if (product.type === ProductType.PRODUCT) {
        const productVariant = product.variants.find(
          (variant) => variant.sku === item.sku
        );
        if (
          !productVariant?.quantity ||
          productVariant.quantity < item.quantity
        ) {
          cartErrors.push({
            Name: 'ProductIssue',
            Error: 'ProductHaveLessQuantityAsCart',
            Variables: {
              title: product.title,
              quantity: productVariant.quantity,
              itemQuantity: item.quantity,
            },
          });
          await this.removeItemFromCart(cart.id, item.productId, item.sku);
        }
      }
      if (
        product.type === ProductType.WORKSHOP &&
        (product.noOfSeats || 0 - product.bookedSeats || 0) < item.quantity
      ) {
        cartErrors.push({
          Name: 'WorkshopIssue',
          Error: 'WorkshopHaveLessSeatAsCart',
          Variables: {
            title: product.title,
            quantity: product.noOfSeats - product.bookedSeats,
            itemQuantity: item.quantity,
          },
        });
        await this.removeItemFromCart(cart.id, item.productId, item.sku);
      }
      if (product.type === ProductType.SERVICE) {
        const booking = await this.prisma.booking.findFirst({
          where: {
            cartId: cart.id,
          },
        });
        if (!booking) {
          cartErrors.push({
            Name: 'ServiceIssue',
            Error: 'ServiceIsNotAvailable',
            Variables: {
              title: product.title,
            },
          });
          await this.removeItemFromCart(cart.id, item.productId, item.sku);
        }
      }
    }

    return cartErrors;
  };

  createWayBillData = async (order: Order, vendor: Vendor) => {
    let wayBillData: WayBill = null;
    if (order.consigneeAddress) {
      const WayBillRequestObject: CreateShipmentInput = {
        ConsigneeAddress: {
          ContactName: order.consigneeAddress?.contactName,
          ContactPhoneNumber: order.consigneeAddress?.contactPhoneNumber,
          //this is hardcoded for now
          Country: 'SA',
          City: order.consigneeAddress?.city,
          AddressLine1: order.consigneeAddress?.addressLine1,
        },
        ShipperAddress: {
          ContactName: vendor.name || 'Company Name',
          ContactPhoneNumber: vendor?.info?.phone || '06012312312',
          Country: 'SA',
          City: vendor?.info?.city || 'Riyadh',
          AddressLine1: vendor?.info?.address || 'Ar Rawdah, Jeddah 23434',
        },
        OrderNumber: order?.orderId,
        DeclaredValue: order?.subTotal,
        CODAmount: 30,
        Parcels: 1,
        ShipDate: new Date().toISOString(),
        ShipmentCurrency: 'SAR',
        Weight: 15,
        WaybillType: 'PDF',
        WeightUnit: 'KG',
        ContentDescription: 'Shipment contents description',
      };
      await this.shippingService
        .createShipment(WayBillRequestObject)
        .then((data) => {
          wayBillData = data;
        })
        .catch((err) => console.log(err));
    }

    return wayBillData;
  };
}
