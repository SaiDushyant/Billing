"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const prisma_1 = require("../../config/prisma");
class ProductsService {
    static async createCategory(name) {
        return prisma_1.prisma.category.create({
            data: {
                name,
            },
        });
    }
    static async createBrand(name, categoryId) {
        return prisma_1.prisma.brand.create({
            data: {
                name,
                categoryId,
            },
        });
    }
    static async createProduct(name, brandId, description) {
        return prisma_1.prisma.product.create({
            data: {
                name,
                brandId,
                description,
            },
        });
    }
    static async createVariant(data) {
        return prisma_1.prisma.productVariant.create({
            data: {
                ...data,
            },
        });
    }
    static async searchVariants(search) {
        return prisma_1.prisma.productVariant.findMany({
            where: {
                OR: [
                    {
                        sku: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        barcode: {
                            contains: search,
                        },
                    },
                    {
                        displayName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            include: {
                product: {
                    include: {
                        brand: true,
                    },
                },
            },
            take: 20,
        });
    }
}
exports.ProductsService = ProductsService;
