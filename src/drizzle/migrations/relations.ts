import { relations } from "drizzle-orm/relations";
import { users, fishAuctions, fishProducts, auctionBids, fishCategories, dailyFishPrices, umkmProducts, warehouseItems, stockTransactions, restaurantStaff, restaurantOrders, restaurantOrderItems, restaurantMenuItems, ponds, iotSensors, customers, products, orders, payments, pondActivities, sensorReadings, notifications, iotControls, orderItems, analyticsMetrics, inventory, stockMovements, transactions, trainingMaterials, userTrainingProgress, collections, collectionPrompts, prompts, chats, messages, perumahanRegions, perumahanUsers, perumahanAttendance, perumahanHouses, perumahanInvoices } from "./schema";

export const fishAuctionsRelations = relations(fishAuctions, ({one, many}) => ({
	user_sellerId: one(users, {
		fields: [fishAuctions.sellerId],
		references: [users.id],
		relationName: "fishAuctions_sellerId_users_id"
	}),
	fishProduct: one(fishProducts, {
		fields: [fishAuctions.productId],
		references: [fishProducts.id]
	}),
	user_highestBidderId: one(users, {
		fields: [fishAuctions.highestBidderId],
		references: [users.id],
		relationName: "fishAuctions_highestBidderId_users_id"
	}),
	auctionBids: many(auctionBids),
}));

export const usersRelations = relations(users, ({many}) => ({
	fishAuctions_sellerId: many(fishAuctions, {
		relationName: "fishAuctions_sellerId_users_id"
	}),
	fishAuctions_highestBidderId: many(fishAuctions, {
		relationName: "fishAuctions_highestBidderId_users_id"
	}),
	auctionBids: many(auctionBids),
	fishProducts: many(fishProducts),
	umkmProducts: many(umkmProducts),
	customers: many(customers),
	products: many(products),
	orders: many(orders),
	payments: many(payments),
	pondActivities: many(pondActivities),
	notifications: many(notifications),
	ponds: many(ponds),
	analyticsMetrics: many(analyticsMetrics),
	inventories: many(inventory),
	transactions: many(transactions),
	userTrainingProgresses: many(userTrainingProgress),
}));

export const fishProductsRelations = relations(fishProducts, ({one, many}) => ({
	fishAuctions: many(fishAuctions),
	fishCategory: one(fishCategories, {
		fields: [fishProducts.categoryId],
		references: [fishCategories.id]
	}),
	user: one(users, {
		fields: [fishProducts.sellerId],
		references: [users.id]
	}),
}));

export const auctionBidsRelations = relations(auctionBids, ({one}) => ({
	fishAuction: one(fishAuctions, {
		fields: [auctionBids.auctionId],
		references: [fishAuctions.id]
	}),
	user: one(users, {
		fields: [auctionBids.bidderId],
		references: [users.id]
	}),
}));

export const dailyFishPricesRelations = relations(dailyFishPrices, ({one}) => ({
	fishCategory: one(fishCategories, {
		fields: [dailyFishPrices.fishCategoryId],
		references: [fishCategories.id]
	}),
}));

export const fishCategoriesRelations = relations(fishCategories, ({many}) => ({
	dailyFishPrices: many(dailyFishPrices),
	fishProducts: many(fishProducts),
}));

export const umkmProductsRelations = relations(umkmProducts, ({one}) => ({
	user: one(users, {
		fields: [umkmProducts.sellerId],
		references: [users.id]
	}),
}));

export const stockTransactionsRelations = relations(stockTransactions, ({one}) => ({
	warehouseItem: one(warehouseItems, {
		fields: [stockTransactions.itemId],
		references: [warehouseItems.id]
	}),
}));

export const warehouseItemsRelations = relations(warehouseItems, ({many}) => ({
	stockTransactions: many(stockTransactions),
}));

export const restaurantOrdersRelations = relations(restaurantOrders, ({one, many}) => ({
	restaurantStaff_processedByCashier: one(restaurantStaff, {
		fields: [restaurantOrders.processedByCashier],
		references: [restaurantStaff.nip],
		relationName: "restaurantOrders_processedByCashier_restaurantStaff_nip"
	}),
	restaurantStaff_servedBy: one(restaurantStaff, {
		fields: [restaurantOrders.servedBy],
		references: [restaurantStaff.nip],
		relationName: "restaurantOrders_servedBy_restaurantStaff_nip"
	}),
	restaurantStaff_handledByKitchen: one(restaurantStaff, {
		fields: [restaurantOrders.handledByKitchen],
		references: [restaurantStaff.nip],
		relationName: "restaurantOrders_handledByKitchen_restaurantStaff_nip"
	}),
	restaurantOrderItems: many(restaurantOrderItems),
}));

export const restaurantStaffRelations = relations(restaurantStaff, ({many}) => ({
	restaurantOrders_processedByCashier: many(restaurantOrders, {
		relationName: "restaurantOrders_processedByCashier_restaurantStaff_nip"
	}),
	restaurantOrders_servedBy: many(restaurantOrders, {
		relationName: "restaurantOrders_servedBy_restaurantStaff_nip"
	}),
	restaurantOrders_handledByKitchen: many(restaurantOrders, {
		relationName: "restaurantOrders_handledByKitchen_restaurantStaff_nip"
	}),
}));

export const restaurantOrderItemsRelations = relations(restaurantOrderItems, ({one}) => ({
	restaurantOrder: one(restaurantOrders, {
		fields: [restaurantOrderItems.orderId],
		references: [restaurantOrders.id]
	}),
	restaurantMenuItem: one(restaurantMenuItems, {
		fields: [restaurantOrderItems.menuItemId],
		references: [restaurantMenuItems.id]
	}),
}));

export const restaurantMenuItemsRelations = relations(restaurantMenuItems, ({many}) => ({
	restaurantOrderItems: many(restaurantOrderItems),
}));

export const iotSensorsRelations = relations(iotSensors, ({one, many}) => ({
	pond: one(ponds, {
		fields: [iotSensors.pondId],
		references: [ponds.id]
	}),
	sensorReadings: many(sensorReadings),
}));

export const pondsRelations = relations(ponds, ({one, many}) => ({
	iotSensors: many(iotSensors),
	pondActivities: many(pondActivities),
	sensorReadings: many(sensorReadings),
	user: one(users, {
		fields: [ponds.userId],
		references: [users.id]
	}),
	iotControls: many(iotControls),
}));

export const customersRelations = relations(customers, ({one}) => ({
	user: one(users, {
		fields: [customers.userId],
		references: [users.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	user: one(users, {
		fields: [products.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems),
	inventories: many(inventory),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	payments: many(payments),
	orderItems: many(orderItems),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	order: one(orders, {
		fields: [payments.orderId],
		references: [orders.id]
	}),
	user: one(users, {
		fields: [payments.userId],
		references: [users.id]
	}),
}));

export const pondActivitiesRelations = relations(pondActivities, ({one}) => ({
	pond: one(ponds, {
		fields: [pondActivities.pondId],
		references: [ponds.id]
	}),
	user: one(users, {
		fields: [pondActivities.userId],
		references: [users.id]
	}),
}));

export const sensorReadingsRelations = relations(sensorReadings, ({one}) => ({
	pond: one(ponds, {
		fields: [sensorReadings.pondId],
		references: [ponds.id]
	}),
	iotSensor: one(iotSensors, {
		fields: [sensorReadings.sensorId],
		references: [iotSensors.id]
	}),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));

export const iotControlsRelations = relations(iotControls, ({one}) => ({
	pond: one(ponds, {
		fields: [iotControls.pondId],
		references: [ponds.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const analyticsMetricsRelations = relations(analyticsMetrics, ({one}) => ({
	user: one(users, {
		fields: [analyticsMetrics.userId],
		references: [users.id]
	}),
}));

export const inventoryRelations = relations(inventory, ({one, many}) => ({
	product: one(products, {
		fields: [inventory.productId],
		references: [products.id]
	}),
	user: one(users, {
		fields: [inventory.userId],
		references: [users.id]
	}),
	stockMovements: many(stockMovements),
}));

export const stockMovementsRelations = relations(stockMovements, ({one}) => ({
	inventory: one(inventory, {
		fields: [stockMovements.inventoryId],
		references: [inventory.id]
	}),
}));

export const transactionsRelations = relations(transactions, ({one}) => ({
	user: one(users, {
		fields: [transactions.userId],
		references: [users.id]
	}),
}));

export const userTrainingProgressRelations = relations(userTrainingProgress, ({one}) => ({
	trainingMaterial: one(trainingMaterials, {
		fields: [userTrainingProgress.materialId],
		references: [trainingMaterials.id]
	}),
	user: one(users, {
		fields: [userTrainingProgress.userId],
		references: [users.id]
	}),
}));

export const trainingMaterialsRelations = relations(trainingMaterials, ({many}) => ({
	userTrainingProgresses: many(userTrainingProgress),
}));

export const collectionPromptsRelations = relations(collectionPrompts, ({one}) => ({
	collection: one(collections, {
		fields: [collectionPrompts.collectionId],
		references: [collections.id]
	}),
	prompt: one(prompts, {
		fields: [collectionPrompts.promptId],
		references: [prompts.id]
	}),
}));

export const collectionsRelations = relations(collections, ({many}) => ({
	collectionPrompts: many(collectionPrompts),
}));

export const promptsRelations = relations(prompts, ({many}) => ({
	collectionPrompts: many(collectionPrompts),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));

export const chatsRelations = relations(chats, ({many}) => ({
	messages: many(messages),
}));

export const perumahanUsersRelations = relations(perumahanUsers, ({one, many}) => ({
	perumahanRegion: one(perumahanRegions, {
		fields: [perumahanUsers.regionId],
		references: [perumahanRegions.id]
	}),
	perumahanAttendances: many(perumahanAttendance),
	perumahanInvoices: many(perumahanInvoices),
}));

export const perumahanRegionsRelations = relations(perumahanRegions, ({many}) => ({
	perumahanUsers: many(perumahanUsers),
	perumahanHouses: many(perumahanHouses),
}));

export const perumahanAttendanceRelations = relations(perumahanAttendance, ({one}) => ({
	perumahanUser: one(perumahanUsers, {
		fields: [perumahanAttendance.userId],
		references: [perumahanUsers.id]
	}),
}));

export const perumahanHousesRelations = relations(perumahanHouses, ({one, many}) => ({
	perumahanRegion: one(perumahanRegions, {
		fields: [perumahanHouses.regionId],
		references: [perumahanRegions.id]
	}),
	perumahanInvoices: many(perumahanInvoices),
}));

export const perumahanInvoicesRelations = relations(perumahanInvoices, ({one}) => ({
	perumahanUser: one(perumahanUsers, {
		fields: [perumahanInvoices.salesmanId],
		references: [perumahanUsers.id]
	}),
	perumahanHouse: one(perumahanHouses, {
		fields: [perumahanInvoices.houseId],
		references: [perumahanHouses.id]
	}),
}));