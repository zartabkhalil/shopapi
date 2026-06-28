import { Prisma, Product } from "@prisma/client";
import prisma from "../config/db";
import { PaginatedProducts } from "../types/product.types";

export default class ProductRepository {
  //:::setters
  create = async (data: Prisma.ProductCreateInput): Promise<Product> => {
    return prisma.product.create({
      data,
    });
  };

  //:::update by id
  updateById = async (
    id: number,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> => {
    return prisma.product.update({
      where: {
        id,
      },
      data,
    });
  };

  findAll = async (page: number, limit: number): Promise<PaginatedProducts> => {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },
        where: {
          isActive: true,
        },

        include: {
          category: true,
        },
      }),

      prisma.product.count({
        where: {
          isActive: true,
        },
      }),
    ]);
    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  findById = async (id: number): Promise<Product | null> => {
    return prisma.product.findFirst({
      where: {
        id,
        isActive: true,
      },
      include: { category: true },
    });
  };

  disableById = async (id: number): Promise<Product | null> => {
    return prisma.product.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  };
}
