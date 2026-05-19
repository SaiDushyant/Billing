"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const pricing_1 = require("../../utils/pricing");
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
        const openingStock = data.openingStock || 0;
        return prisma_1.prisma.$transaction(async (tx) => {
            const variant = await tx.productVariant.create({
                data: {
                    productId: data.productId,
                    displayName: data.displayName,
                    attributes: data.attributes,
                    costPrice: data.costPrice,
                    mrp: data.mrp,
                    profitMargin: data.profitMargin,
                    gstRate: data.gstRate,
                    sku: data.sku,
                    barcode: data.barcode,
                    currentStock: openingStock,
                },
            });
            if (openingStock > 0) {
                await tx.stockMovement.create({
                    data: {
                        variantId: variant.id,
                        type: "PURCHASE",
                        quantity: openingStock,
                        notes: "Opening stock",
                    },
                });
            }
            return variant;
        });
    }
    static async searchVariants(search) {
        const variants = await prisma_1.prisma.productVariant.findMany({
            where: {
                OR: [
                    {
                        sku: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive,
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
                            mode: client_1.Prisma.QueryMode.insensitive,
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
        return variants.map((variant) => ({
            ...variant,
            sellingPrice: (0, pricing_1.calculateSellingPrice)(Number(variant.costPrice), Number(variant.profitMargin)),
        }));
    }
    static async getVariantById(id) {
        return prisma_1.prisma.productVariant.findUnique({
            where: {
                id,
            },
        });
    }
    static async updateVariant(id, data) {
        return prisma_1.prisma.productVariant.update({
            where: {
                id,
            },
            data,
        });
    }
    static async getVariants(options) {
        const page = options.page || 1;
        const limit = options.limit || 20;
        const skip = (page - 1) * limit;
        const where = options.search
            ? {
                OR: [
                    {
                        displayName: {
                            contains: options.search,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        sku: {
                            contains: options.search,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        barcode: {
                            contains: options.search,
                        },
                    },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            prisma_1.prisma.productVariant.findMany({
                where,
                skip,
                take: limit,
                include: {
                    product: {
                        include: {
                            brand: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma_1.prisma.productVariant.count({
                where,
            }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    static async importVariants(rows) {
        const results = [];
        for (const row of rows) {
            try {
                let category = await prisma_1.prisma.category.findFirst({
                    where: {
                        name: row.categoryName,
                    },
                });
                if (!category) {
                    category = await prisma_1.prisma.category.create({
                        data: {
                            name: row.categoryName,
                        },
                    });
                }
                let brand = await prisma_1.prisma.brand.findFirst({
                    where: {
                        name: row.brandName,
                    },
                });
                if (!brand) {
                    brand = await prisma_1.prisma.brand.create({
                        data: {
                            name: row.brandName,
                            categoryId: category.id,
                        },
                    });
                }
                let product = await prisma_1.prisma.product.findFirst({
                    where: {
                        name: row.productName,
                    },
                });
                if (!product) {
                    product = await prisma_1.prisma.product.create({
                        data: {
                            name: row.productName,
                            brandId: brand.id,
                        },
                    });
                }
                const existingVariant = await prisma_1.prisma.productVariant.findFirst({
                    where: {
                        OR: [
                            {
                                sku: row.sku,
                            },
                            {
                                barcode: row.barcode,
                            },
                        ],
                    },
                });
                if (existingVariant) {
                    results.push({
                        success: false,
                        error: "SKU or barcode already exists",
                        row,
                    });
                    continue;
                }
                const qty = Number(row.quantity || 0);
                const variant = await prisma_1.prisma.$transaction(async (tx) => {
                    const createdVariant = await tx.productVariant.create({
                        data: {
                            productId: product.id,
                            displayName: row.displayName,
                            sku: row.sku,
                            barcode: row.barcode,
                            attributes: {},
                            costPrice: Number(row.costPrice),
                            mrp: Number(row.mrp),
                            profitMargin: Number(row.profitMargin),
                            gstRate: Number(row.gstRate),
                            currentStock: qty,
                        },
                    });
                    if (qty > 0) {
                        await tx.stockMovement.create({
                            data: {
                                variantId: createdVariant.id,
                                type: "PURCHASE",
                                quantity: qty,
                                notes: "Opening stock import",
                            },
                        });
                    }
                    return createdVariant;
                });
                results.push({
                    success: true,
                    variant,
                });
            }
            catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    row,
                });
            }
        }
        return results;
    }
}
exports.ProductsService = ProductsService;
