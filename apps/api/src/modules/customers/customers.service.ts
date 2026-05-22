import { Prisma } from "@prisma/client";

import { prisma } from "../../config/prisma";

export class CustomersService {
  static async searchCustomers(search: string) {
    return prisma.customer.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,

              mode: Prisma.QueryMode.insensitive,
            },
          },

          {
            phone: {
              contains: search,
            },
          },

          {
            email: {
              contains: search,

              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      },

      take: 10,

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async createCustomer(data: {
    name: string;

    phone?: string;

    email?: string;

    address?: string;

    gstNumber?: string;
  }) {
    // EXISTING PHONE CHECK
    if (data.phone) {
      const existing = await prisma.customer.findUnique({
        where: {
          phone: data.phone,
        },
      });

      if (existing) {
        return existing;
      }
    }

    return prisma.customer.create({
      data,
    });
  }

  static async updateCustomer(
    id: string,

    data: {
      name?: string;

      phone?: string;

      email?: string;

      address?: string;

      gstNumber?: string;
    },
  ) {
    return prisma.customer.update({
      where: {
        id,
      },

      data,
    });
  }

  static async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: {
        id,
      },
    });
  }
}
