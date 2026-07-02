import { Order, Prisma } from "@prisma/client";
import prisma from "../config/db";
type OrderItem = {
  productId: number;
  quantity: number;
  price: number;
}[];
export default class OrderRepository {
  create = async (
    order: Prisma.OrderCreateInput,
    orderItems: OrderItem,
    userId: number,
  ): Promise<Order> => {
    return prisma.$transaction(async (tx) => {
      //order
      const orderResult = await tx.order.create({ data: order });

      //createin order items
      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          orderId: orderResult.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      //reduce stock
      for (const item of orderItems) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      //clear cart
      await tx.cart.deleteMany({
        where: {
          userId,
        },
      });
      return orderResult;
    });
  };

  //find all order agains a userId

  findManyById = async (userId: number): Promise<Order[]> => {
    return prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  findById = async (id: number, userId?: number): Promise<Order | null> => {
    return prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                price: true,
                discount: true,
                image: true,
              },
            },
          },
        },
      },
    });
  };

  updateById = async (id: number, data: any): Promise<Order> => {
    return prisma.order.update({
      where: {
        id,
      },
      data,
    });
  };
}
