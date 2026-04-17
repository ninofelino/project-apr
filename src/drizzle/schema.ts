import { pgTable, serial, varchar, text, timestamp, unique, foreignKey, integer, numeric, date, real, index, check, boolean, jsonb, uuid, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const perumahanAttendanceType = pgEnum("perumahan_attendance_type", ['CLOCK_IN', 'CLOCK_OUT'])
export const perumahanInvoiceStatus = pgEnum("perumahan_invoice_status", ['PENDING', 'PAID', 'CANCELLED'])
export const perumahanRole = pgEnum("perumahan_role", ['ADMIN', 'MANAGER', 'SALESMAN'])
export const perumahanStatus = pgEnum("perumahan_status", ['AVAILABLE', 'SOLD', 'RESERVED'])


export const aiPrompts = pgTable("ai_prompts", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	prompt: text().notNull(),
	category: varchar({ length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 50 }).notNull(),
	phone: varchar({ length: 20 }),
	address: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	businessName: varchar("business_name", { length: 255 }),
	businessType: varchar("business_type", { length: 100 }),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const fishAuctions = pgTable("fish_auctions", {
	id: serial().primaryKey().notNull(),
	sellerId: integer("seller_id").notNull(),
	productId: integer("product_id").notNull(),
	startingPrice: numeric("starting_price", { precision: 10, scale:  2 }).notNull(),
	currentPrice: numeric("current_price", { precision: 10, scale:  2 }).notNull(),
	highestBidderId: integer("highest_bidder_id"),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { mode: 'string' }).notNull(),
	status: varchar({ length: 50 }).default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		fishAuctionsSellerIdUsersIdFk: foreignKey({
			columns: [table.sellerId],
			foreignColumns: [users.id],
			name: "fish_auctions_seller_id_users_id_fk"
		}),
		fishAuctionsProductIdFishProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [fishProducts.id],
			name: "fish_auctions_product_id_fish_products_id_fk"
		}),
		fishAuctionsHighestBidderIdUsersIdFk: foreignKey({
			columns: [table.highestBidderId],
			foreignColumns: [users.id],
			name: "fish_auctions_highest_bidder_id_users_id_fk"
		}),
	}
});

export const auctionBids = pgTable("auction_bids", {
	id: serial().primaryKey().notNull(),
	auctionId: integer("auction_id").notNull(),
	bidderId: integer("bidder_id").notNull(),
	bidAmount: numeric("bid_amount", { precision: 10, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		auctionBidsAuctionIdFishAuctionsIdFk: foreignKey({
			columns: [table.auctionId],
			foreignColumns: [fishAuctions.id],
			name: "auction_bids_auction_id_fish_auctions_id_fk"
		}),
		auctionBidsBidderIdUsersIdFk: foreignKey({
			columns: [table.bidderId],
			foreignColumns: [users.id],
			name: "auction_bids_bidder_id_users_id_fk"
		}),
	}
});

export const fishCategories = pgTable("fish_categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const dailyFishPrices = pgTable("daily_fish_prices", {
	id: serial().primaryKey().notNull(),
	fishCategoryId: integer("fish_category_id").notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	marketName: varchar("market_name", { length: 255 }),
	priceDate: date("price_date").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		dailyFishPricesFishCategoryIdFishCategoriesIdFk: foreignKey({
			columns: [table.fishCategoryId],
			foreignColumns: [fishCategories.id],
			name: "daily_fish_prices_fish_category_id_fish_categories_id_fk"
		}),
	}
});

export const fishProducts = pgTable("fish_products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	categoryId: integer("category_id"),
	sellerId: integer("seller_id").notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	unit: varchar({ length: 50 }).notNull(),
	stock: integer().default(0),
	description: text(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		fishProductsCategoryIdFishCategoriesIdFk: foreignKey({
			columns: [table.categoryId],
			foreignColumns: [fishCategories.id],
			name: "fish_products_category_id_fish_categories_id_fk"
		}),
		fishProductsSellerIdUsersIdFk: foreignKey({
			columns: [table.sellerId],
			foreignColumns: [users.id],
			name: "fish_products_seller_id_users_id_fk"
		}),
	}
});

export const umkmProducts = pgTable("umkm_products", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	sellerId: integer("seller_id").notNull(),
	category: varchar({ length: 100 }),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	stock: integer().default(0),
	description: text(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		umkmProductsSellerIdUsersIdFk: foreignKey({
			columns: [table.sellerId],
			foreignColumns: [users.id],
			name: "umkm_products_seller_id_users_id_fk"
		}),
	}
});

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	value: real(),
});

export const warehouseItems = pgTable("warehouse_items", {
	id: serial().primaryKey().notNull(),
	sku: varchar({ length: 50 }).notNull(),
	barcode: varchar({ length: 100 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	category: varchar({ length: 100 }).notNull(),
	quantity: integer().default(0).notNull(),
	minStock: integer("min_stock").default(10).notNull(),
	unit: varchar({ length: 50 }).default('pcs').notNull(),
	location: varchar({ length: 100 }),
	supplier: varchar({ length: 255 }),
	costPrice: numeric("cost_price", { precision: 12, scale:  2 }).default('0').notNull(),
	sellingPrice: numeric("selling_price", { precision: 12, scale:  2 }).default('0').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxWarehouseItemsBarcode: index("idx_warehouse_items_barcode").using("btree", table.barcode.asc().nullsLast().op("text_ops")),
		idxWarehouseItemsCategory: index("idx_warehouse_items_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
		warehouseItemsSkuKey: unique("warehouse_items_sku_key").on(table.sku),
		warehouseItemsBarcodeKey: unique("warehouse_items_barcode_key").on(table.barcode),
	}
});

export const stockTransactions = pgTable("stock_transactions", {
	id: serial().primaryKey().notNull(),
	itemId: integer("item_id"),
	type: varchar({ length: 20 }).notNull(),
	quantity: integer().notNull(),
	previousQuantity: integer("previous_quantity").notNull(),
	newQuantity: integer("new_quantity").notNull(),
	reason: varchar({ length: 255 }).notNull(),
	reference: varchar({ length: 100 }),
	performedBy: varchar("performed_by", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxStockTransactionsCreatedAt: index("idx_stock_transactions_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
		idxStockTransactionsItemId: index("idx_stock_transactions_item_id").using("btree", table.itemId.asc().nullsLast().op("int4_ops")),
		stockTransactionsItemIdFkey: foreignKey({
			columns: [table.itemId],
			foreignColumns: [warehouseItems.id],
			name: "stock_transactions_item_id_fkey"
		}).onDelete("cascade"),
		stockTransactionsTypeCheck: check("stock_transactions_type_check", sql`(type)::text = ANY ((ARRAY['in'::character varying, 'out'::character varying, 'adjustment'::character varying])::text[])`),
	}
});

export const restaurantOrders = pgTable("restaurant_orders", {
	id: serial().primaryKey().notNull(),
	orderNumber: varchar("order_number", { length: 50 }).notNull(),
	tableNumber: integer("table_number").notNull(),
	status: varchar({ length: 50 }).default('pending').notNull(),
	subtotal: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	tax: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	total: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }),
	paymentStatus: varchar("payment_status", { length: 50 }).default('pending'),
	servedBy: varchar("served_by", { length: 50 }),
	handledByKitchen: varchar("handled_by_kitchen", { length: 50 }),
	processedByCashier: varchar("processed_by_cashier", { length: 50 }),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	discount: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	taxableAmount: numeric("taxable_amount", { precision: 12, scale:  2 }).default('0').notNull(),
	pb1Rate: numeric("pb1_rate", { precision: 5, scale:  2 }).default('10').notNull(),
	pb1Amount: numeric("pb1_amount", { precision: 12, scale:  2 }).default('0').notNull(),
	serviceChargeRate: numeric("service_charge_rate", { precision: 5, scale:  2 }).default('5').notNull(),
	serviceChargeAmount: numeric("service_charge_amount", { precision: 12, scale:  2 }).default('0').notNull(),
	totalBeforeTax: numeric("total_before_tax", { precision: 12, scale:  2 }).default('0').notNull(),
	pphFinalRate: numeric("pph_final_rate", { precision: 5, scale:  4 }).default('0.5').notNull(),
	pphFinalAmount: numeric("pph_final_amount", { precision: 12, scale:  2 }).default('0').notNull(),
}, (table) => {
	return {
		idxOrdersPayment: index("idx_orders_payment").using("btree", table.paymentStatus.asc().nullsLast().op("text_ops")),
		idxOrdersStatus: index("idx_orders_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		idxOrdersTable: index("idx_orders_table").using("btree", table.tableNumber.asc().nullsLast().op("int4_ops")),
		restaurantOrdersProcessedByCashierFkey: foreignKey({
			columns: [table.processedByCashier],
			foreignColumns: [restaurantStaff.nip],
			name: "restaurant_orders_processed_by_cashier_fkey"
		}),
		restaurantOrdersServedByFkey: foreignKey({
			columns: [table.servedBy],
			foreignColumns: [restaurantStaff.nip],
			name: "restaurant_orders_served_by_fkey"
		}),
		restaurantOrdersHandledByKitchenFkey: foreignKey({
			columns: [table.handledByKitchen],
			foreignColumns: [restaurantStaff.nip],
			name: "restaurant_orders_handled_by_kitchen_fkey"
		}),
		restaurantOrdersOrderNumberKey: unique("restaurant_orders_order_number_key").on(table.orderNumber),
		restaurantOrdersStatusCheck: check("restaurant_orders_status_check", sql`(status)::text = ANY ((ARRAY['pending'::character varying, 'cooking'::character varying, 'ready'::character varying, 'served'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])`),
		restaurantOrdersPaymentStatusCheck: check("restaurant_orders_payment_status_check", sql`(payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'refunded'::character varying])::text[])`),
	}
});

export const restaurantStaff = pgTable("restaurant_staff", {
	id: serial().primaryKey().notNull(),
	nip: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	role: varchar({ length: 50 }).notNull(),
	pin: varchar({ length: 10 }).notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxStaffRole: index("idx_staff_role").using("btree", table.role.asc().nullsLast().op("text_ops")),
		idxStaffStatus: index("idx_staff_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		restaurantStaffNipKey: unique("restaurant_staff_nip_key").on(table.nip),
		restaurantStaffEmailKey: unique("restaurant_staff_email_key").on(table.email),
		restaurantStaffRoleCheck: check("restaurant_staff_role_check", sql`(role)::text = ANY ((ARRAY['pramusaji'::character varying, 'dapur'::character varying, 'kasir'::character varying, 'manager'::character varying])::text[])`),
		restaurantStaffStatusCheck: check("restaurant_staff_status_check", sql`(status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'on_leave'::character varying])::text[])`),
	}
});

export const restaurantOrderItems = pgTable("restaurant_order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id"),
	menuItemId: integer("menu_item_id"),
	menuItemName: varchar("menu_item_name", { length: 255 }).notNull(),
	quantity: integer().default(1).notNull(),
	unitPrice: numeric("unit_price", { precision: 12, scale:  2 }).default('0').notNull(),
	subtotal: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	notes: text(),
	status: varchar({ length: 50 }).default('pending'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		restaurantOrderItemsOrderIdFkey: foreignKey({
			columns: [table.orderId],
			foreignColumns: [restaurantOrders.id],
			name: "restaurant_order_items_order_id_fkey"
		}).onDelete("cascade"),
		restaurantOrderItemsMenuItemIdFkey: foreignKey({
			columns: [table.menuItemId],
			foreignColumns: [restaurantMenuItems.id],
			name: "restaurant_order_items_menu_item_id_fkey"
		}),
		restaurantOrderItemsStatusCheck: check("restaurant_order_items_status_check", sql`(status)::text = ANY ((ARRAY['pending'::character varying, 'cooking'::character varying, 'ready'::character varying, 'served'::character varying, 'cancelled'::character varying])::text[])`),
	}
});

export const restaurantMenuItems = pgTable("restaurant_menu_items", {
	id: serial().primaryKey().notNull(),
	sku: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	description: text(),
	price: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	prepTime: integer("prep_time").default(15).notNull(),
	available: boolean().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxMenuItemsAvailable: index("idx_menu_items_available").using("btree", table.available.asc().nullsLast().op("bool_ops")),
		idxMenuItemsCategory: index("idx_menu_items_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
		restaurantMenuItemsSkuKey: unique("restaurant_menu_items_sku_key").on(table.sku),
	}
});

export const employees = pgTable("employees", {
	id: serial().primaryKey().notNull(),
	nip: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	department: varchar({ length: 100 }).notNull(),
	position: varchar({ length: 100 }).notNull(),
	salary: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	joinDate: date("join_date").notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	address: text(),
	emergencyContact: varchar("emergency_contact", { length: 255 }),
	emergencyPhone: varchar("emergency_phone", { length: 20 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxEmployeesDepartment: index("idx_employees_department").using("btree", table.department.asc().nullsLast().op("text_ops")),
		idxEmployeesEmail: index("idx_employees_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
		idxEmployeesNip: index("idx_employees_nip").using("btree", table.nip.asc().nullsLast().op("text_ops")),
		idxEmployeesStatus: index("idx_employees_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		employeesNipKey: unique("employees_nip_key").on(table.nip),
		employeesEmailKey: unique("employees_email_key").on(table.email),
		employeesStatusCheck: check("employees_status_check", sql`(status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'on_leave'::character varying])::text[])`),
	}
});

export const restaurantTables = pgTable("restaurant_tables", {
	id: serial().primaryKey().notNull(),
	tableNumber: integer("table_number").notNull(),
	capacity: integer().notNull(),
	section: varchar({ length: 100 }).notNull(),
	status: varchar({ length: 50 }).default('available').notNull(),
	currentOrderId: integer("current_order_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	description: text(),
	image: text(),
}, (table) => {
	return {
		idxTablesSection: index("idx_tables_section").using("btree", table.section.asc().nullsLast().op("text_ops")),
		idxTablesStatus: index("idx_tables_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
		restaurantTablesTableNumberKey: unique("restaurant_tables_table_number_key").on(table.tableNumber),
		restaurantTablesStatusCheck: check("restaurant_tables_status_check", sql`(status)::text = ANY ((ARRAY['available'::character varying, 'occupied'::character varying, 'reserved'::character varying, 'maintenance'::character varying])::text[])`),
	}
});

export const taxConfigurations = pgTable("tax_configurations", {
	id: serial().primaryKey().notNull(),
	configKey: varchar("config_key", { length: 100 }).notNull(),
	configValue: numeric("config_value", { precision: 10, scale:  4 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true),
	effectiveDate: date("effective_date").default(sql`CURRENT_DATE`),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxTaxConfigKey: index("idx_tax_config_key").using("btree", table.configKey.asc().nullsLast().op("text_ops")),
		taxConfigurationsConfigKeyKey: unique("tax_configurations_config_key_key").on(table.configKey),
	}
});

export const taxReports = pgTable("tax_reports", {
	id: serial().primaryKey().notNull(),
	reportPeriod: date("report_period").notNull(),
	reportType: varchar("report_type", { length: 50 }).notNull(),
	totalRevenue: numeric("total_revenue", { precision: 15, scale:  2 }).notNull(),
	totalPb1Collected: numeric("total_pb1_collected", { precision: 15, scale:  2 }).notNull(),
	totalServiceChargeCollected: numeric("total_service_charge_collected", { precision: 15, scale:  2 }).notNull(),
	totalPphFinal: numeric("total_pph_final", { precision: 15, scale:  2 }).notNull(),
	taxableTransactions: integer("taxable_transactions").notNull(),
	status: varchar({ length: 50 }).default('draft'),
	submittedDate: date("submitted_date"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
	return {
		idxTaxReportsPeriod: index("idx_tax_reports_period").using("btree", table.reportPeriod.asc().nullsLast().op("date_ops")),
	}
});

export const microcontrollers = pgTable("microcontrollers", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	family: varchar({ length: 100 }).notNull(),
	description: text(),
	imageUrl: varchar("image_url", { length: 500 }),
	specs: jsonb().notNull(),
	price: numeric({ precision: 10, scale:  2 }),
	stock: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const arduinoCodes = pgTable("arduino_codes", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	code: text().notNull(),
	category: varchar({ length: 100 }),
	difficulty: varchar({ length: 20 }).default('beginner'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const sensorData = pgTable("sensor_data", {
	id: serial().primaryKey().notNull(),
	temperature: numeric({ precision: 5, scale:  2 }).notNull(),
	humidity: numeric({ precision: 5, scale:  2 }).notNull(),
	timestamp: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	deviceId: varchar("device_id", { length: 100 }),
});

export const iotSensors = pgTable("iot_sensors", {
	id: serial().primaryKey().notNull(),
	pondId: integer("pond_id").notNull(),
	deviceId: varchar("device_id", { length: 100 }).notNull(),
	sensorType: varchar("sensor_type", { length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('active').notNull(),
	lastReading: numeric("last_reading", { precision: 10, scale:  2 }),
	unit: varchar({ length: 20 }),
	installedAt: timestamp("installed_at", { mode: 'string' }).defaultNow(),
	lastMaintenance: timestamp("last_maintenance", { mode: 'string' }),
	nextMaintenance: timestamp("next_maintenance", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		iotSensorsPondIdPondsIdFk: foreignKey({
			columns: [table.pondId],
			foreignColumns: [ponds.id],
			name: "iot_sensors_pond_id_ponds_id_fk"
		}),
		iotSensorsDeviceIdUnique: unique("iot_sensors_device_id_unique").on(table.deviceId),
	}
});

export const customers = pgTable("customers", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	address: text(),
	totalOrders: integer("total_orders").default(0),
	totalSpent: numeric("total_spent", { precision: 12, scale:  2 }).default('0'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		customersUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "customers_user_id_users_id_fk"
		}),
	}
});

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	description: text(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
	unit: varchar({ length: 20 }).notNull(),
	imageUrl: text("image_url"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		productsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "products_user_id_users_id_fk"
		}),
	}
});

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	orderNumber: varchar("order_number", { length: 50 }).notNull(),
	customerName: varchar("customer_name", { length: 255 }).notNull(),
	customerPhone: varchar("customer_phone", { length: 20 }),
	customerAddress: text("customer_address"),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	paymentStatus: varchar("payment_status", { length: 20 }).default('unpaid').notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		ordersUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}),
		ordersOrderNumberUnique: unique("orders_order_number_unique").on(table.orderNumber),
	}
});

export const payments = pgTable("payments", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	userId: integer("user_id").notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	method: varchar({ length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	transactionId: varchar("transaction_id", { length: 255 }),
	paymentProof: text("payment_proof"),
	paidAt: timestamp("paid_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		paymentsOrderIdOrdersIdFk: foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "payments_order_id_orders_id_fk"
		}),
		paymentsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "payments_user_id_users_id_fk"
		}),
	}
});

export const pondActivities = pgTable("pond_activities", {
	id: serial().primaryKey().notNull(),
	pondId: integer("pond_id").notNull(),
	userId: integer("user_id").notNull(),
	activityType: varchar("activity_type", { length: 50 }).notNull(),
	description: text().notNull(),
	quantity: numeric({ precision: 10, scale:  2 }),
	unit: varchar({ length: 20 }),
	notes: text(),
	imageUrl: text("image_url"),
	performedAt: timestamp("performed_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		pondActivitiesPondIdPondsIdFk: foreignKey({
			columns: [table.pondId],
			foreignColumns: [ponds.id],
			name: "pond_activities_pond_id_ponds_id_fk"
		}),
		pondActivitiesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "pond_activities_user_id_users_id_fk"
		}),
	}
});

export const sensorReadings = pgTable("sensor_readings", {
	id: serial().primaryKey().notNull(),
	sensorId: integer("sensor_id").notNull(),
	pondId: integer("pond_id").notNull(),
	value: numeric({ precision: 10, scale:  2 }).notNull(),
	unit: varchar({ length: 20 }).notNull(),
	recordedAt: timestamp("recorded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		sensorReadingsPondIdPondsIdFk: foreignKey({
			columns: [table.pondId],
			foreignColumns: [ponds.id],
			name: "sensor_readings_pond_id_ponds_id_fk"
		}),
		sensorReadingsSensorIdIotSensorsIdFk: foreignKey({
			columns: [table.sensorId],
			foreignColumns: [iotSensors.id],
			name: "sensor_readings_sensor_id_iot_sensors_id_fk"
		}),
	}
});

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	referenceId: integer("reference_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		notificationsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_users_id_fk"
		}),
	}
});

export const ponds = pgTable("ponds", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	size: numeric({ precision: 10, scale:  2 }).notNull(),
	depth: numeric({ precision: 10, scale:  2 }),
	capacity: integer(),
	currentStock: integer("current_stock").default(0),
	fishType: varchar("fish_type", { length: 100 }),
	imageUrl: text("image_url"),
	status: varchar({ length: 20 }).default('active').notNull(),
	location: varchar({ length: 255 }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		pondsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "ponds_user_id_users_id_fk"
		}),
	}
});

export const iotControls = pgTable("iot_controls", {
	id: serial().primaryKey().notNull(),
	pondId: integer("pond_id").notNull(),
	deviceId: varchar("device_id", { length: 100 }).notNull(),
	controlType: varchar("control_type", { length: 50 }).notNull(),
	status: varchar({ length: 20 }).default('off').notNull(),
	lastActivated: timestamp("last_activated", { mode: 'string' }),
	schedule: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		iotControlsPondIdPondsIdFk: foreignKey({
			columns: [table.pondId],
			foreignColumns: [ponds.id],
			name: "iot_controls_pond_id_ponds_id_fk"
		}),
	}
});

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: numeric({ precision: 12, scale:  2 }).notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
	subtotal: numeric({ precision: 12, scale:  2 }).notNull(),
}, (table) => {
	return {
		orderItemsOrderIdOrdersIdFk: foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}),
		orderItemsProductIdProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_products_id_fk"
		}),
	}
});

export const analyticsMetrics = pgTable("analytics_metrics", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	metricType: varchar("metric_type", { length: 50 }).notNull(),
	metricData: jsonb("metric_data").notNull(),
	period: varchar({ length: 20 }).notNull(),
	calculatedAt: timestamp("calculated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		analyticsMetricsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "analytics_metrics_user_id_users_id_fk"
		}),
	}
});

export const inventory = pgTable("inventory", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: numeric({ precision: 12, scale:  2 }).notNull(),
	minQuantity: numeric("min_quantity", { precision: 12, scale:  2 }).notNull(),
	location: varchar({ length: 255 }),
	lastRestocked: timestamp("last_restocked", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		inventoryProductIdProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "inventory_product_id_products_id_fk"
		}),
		inventoryUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "inventory_user_id_users_id_fk"
		}),
	}
});

export const stockMovements = pgTable("stock_movements", {
	id: serial().primaryKey().notNull(),
	inventoryId: integer("inventory_id").notNull(),
	type: varchar({ length: 20 }).notNull(),
	quantity: numeric({ precision: 12, scale:  2 }).notNull(),
	reason: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		stockMovementsInventoryIdInventoryIdFk: foreignKey({
			columns: [table.inventoryId],
			foreignColumns: [inventory.id],
			name: "stock_movements_inventory_id_inventory_id_fk"
		}),
	}
});

export const transactions = pgTable("transactions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	type: varchar({ length: 20 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	description: text(),
	date: timestamp({ mode: 'string' }).defaultNow().notNull(),
	referenceId: integer("reference_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		transactionsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "transactions_user_id_users_id_fk"
		}),
	}
});

export const trainingMaterials = pgTable("training_materials", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	category: varchar({ length: 100 }).notNull(),
	contentType: varchar("content_type", { length: 20 }).notNull(),
	contentUrl: text("content_url"),
	content: text(),
	imageUrl: text("image_url"),
	author: varchar({ length: 255 }),
	isPublished: boolean("is_published").default(false).notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const userTrainingProgress = pgTable("user_training_progress", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	materialId: integer("material_id").notNull(),
	isCompleted: boolean("is_completed").default(false).notNull(),
	progress: integer().default(0),
	lastAccessedAt: timestamp("last_accessed_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		userTrainingProgressMaterialIdTrainingMaterialsIdFk: foreignKey({
			columns: [table.materialId],
			foreignColumns: [trainingMaterials.id],
			name: "user_training_progress_material_id_training_materials_id_fk"
		}),
		userTrainingProgressUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_training_progress_user_id_users_id_fk"
		}),
	}
});

export const favoriteUrls = pgTable("favorite_urls", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	description: text(),
	category: varchar({ length: 100 }),
	tags: jsonb(),
	method: varchar({ length: 10 }).default('GET'),
	headers: jsonb(),
	body: jsonb(),
	isApi: boolean("is_api").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		favoriteUrlsUrlUnique: unique("favorite_urls_url_unique").on(table.url),
	}
});

export const collections = pgTable("collections", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	color: varchar({ length: 7 }).default('#3B82F6'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		collectionsNameKey: unique("collections_name_key").on(table.name),
	}
});

export const collectionPrompts = pgTable("collection_prompts", {
	id: serial().primaryKey().notNull(),
	collectionId: integer("collection_id").notNull(),
	promptId: integer("prompt_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		uniqueCollectionPrompt: index("unique_collection_prompt").using("btree", table.collectionId.asc().nullsLast().op("int4_ops"), table.promptId.asc().nullsLast().op("int4_ops")),
		collectionPromptsCollectionIdFkey: foreignKey({
			columns: [table.collectionId],
			foreignColumns: [collections.id],
			name: "collection_prompts_collection_id_fkey"
		}).onDelete("cascade"),
		collectionPromptsPromptIdFkey: foreignKey({
			columns: [table.promptId],
			foreignColumns: [prompts.id],
			name: "collection_prompts_prompt_id_fkey"
		}).onDelete("cascade"),
	}
});

export const prompts = pgTable("prompts", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	type: varchar({ length: 20 }).default('music').notNull(),
	category: varchar({ length: 100 }),
	tags: text().array().default([""]),
	description: text(),
	genre: varchar({ length: 100 }),
	mood: varchar({ length: 100 }),
	tempo: varchar({ length: 50 }),
	instruments: text().array().default([""]),
	style: varchar({ length: 100 }),
	duration: varchar({ length: 50 }),
	resolution: varchar({ length: 50 }),
	isFavorite: boolean("is_favorite").default(false),
	usageCount: integer("usage_count").default(0),
	lastUsed: timestamp("last_used", { mode: 'string' }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		categoryIdx: index("category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
		favoriteIdx: index("favorite_idx").using("btree", table.isFavorite.asc().nullsLast().op("bool_ops")),
		tagsIdx: index("tags_idx").using("btree", table.tags.asc().nullsLast().op("array_ops")),
		typeIdx: index("type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	}
});

export const models = pgTable("models", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	modelId: text("model_id").notNull(),
	name: text(),
	description: text(),
	contextLength: integer("context_length"),
	maxCompletionTokens: integer("max_completion_tokens"),
	pricingPrompt: text("pricing_prompt").default('0'),
	pricingCompletion: text("pricing_completion").default('0'),
	isFree: boolean("is_free").default(true).notNull(),
	architecture: text(),
	supportedParameters: text("supported_parameters").array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		idxModelsModelId: index("idx_models_model_id").using("btree", table.modelId.asc().nullsLast().op("text_ops")),
		modelsModelIdKey: unique("models_model_id_key").on(table.modelId),
	}
});

export const chats = pgTable("chats", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	modelId: text("model_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		idxChatsUpdated: index("idx_chats_updated").using("btree", table.updatedAt.desc().nullsFirst().op("timestamp_ops")),
	}
});

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid("chat_id").notNull(),
	role: text().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		idxMessagesChatId: index("idx_messages_chat_id").using("btree", table.chatId.asc().nullsLast().op("uuid_ops")),
		messagesChatIdFkey: foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "messages_chat_id_fkey"
		}).onDelete("cascade"),
	}
});

export const myprompts = pgTable("myprompts", {
	id: serial().primaryKey().notNull(),
	prompt: text().notNull(),
	response: text().notNull(),
	model: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const perumahanUsers = pgTable("perumahan_users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text(),
	role: perumahanRole().default('SALESMAN').notNull(),
	regionId: uuid("region_id"),
}, (table) => {
	return {
		perumahanUsersRegionIdPerumahanRegionsIdFk: foreignKey({
			columns: [table.regionId],
			foreignColumns: [perumahanRegions.id],
			name: "perumahan_users_region_id_perumahan_regions_id_fk"
		}),
		perumahanUsersEmailUnique: unique("perumahan_users_email_unique").on(table.email),
	}
});

export const perumahanAttendance = pgTable("perumahan_attendance", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
	type: perumahanAttendanceType().notNull(),
}, (table) => {
	return {
		perumahanAttendanceUserIdPerumahanUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [perumahanUsers.id],
			name: "perumahan_attendance_user_id_perumahan_users_id_fk"
		}),
	}
});

export const perumahanRegions = pgTable("perumahan_regions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
}, (table) => {
	return {
		perumahanRegionsNameUnique: unique("perumahan_regions_name_unique").on(table.name),
	}
});

export const perumahanHouses = pgTable("perumahan_houses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	address: text().notNull(),
	regionId: uuid("region_id").notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
	status: perumahanStatus().default('AVAILABLE').notNull(),
	imageUrl: text("image_url"),
}, (table) => {
	return {
		perumahanHousesRegionIdPerumahanRegionsIdFk: foreignKey({
			columns: [table.regionId],
			foreignColumns: [perumahanRegions.id],
			name: "perumahan_houses_region_id_perumahan_regions_id_fk"
		}),
	}
});

export const perumahanInvoices = pgTable("perumahan_invoices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	salesmanId: uuid("salesman_id").notNull(),
	houseId: uuid("house_id").notNull(),
	date: timestamp({ mode: 'string' }).defaultNow().notNull(),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).notNull(),
	status: perumahanInvoiceStatus().default('PENDING').notNull(),
}, (table) => {
	return {
		perumahanInvoicesSalesmanIdPerumahanUsersIdFk: foreignKey({
			columns: [table.salesmanId],
			foreignColumns: [perumahanUsers.id],
			name: "perumahan_invoices_salesman_id_perumahan_users_id_fk"
		}),
		perumahanInvoicesHouseIdPerumahanHousesIdFk: foreignKey({
			columns: [table.houseId],
			foreignColumns: [perumahanHouses.id],
			name: "perumahan_invoices_house_id_perumahan_houses_id_fk"
		}),
	}
});

export const documents = pgTable("documents", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
	id: serial().primaryKey().notNull(),
	description: text().notNull(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const salesCategories = pgTable("sales_categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const salesProducts = pgTable("sales_products", {
	id: serial().primaryKey().notNull(),
	categoryId: integer("category_id"),
	sku: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	price: numeric({ precision: 12, scale: 2 }).notNull(),
	stock: integer().default(0).notNull(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		salesProductsCategoryIdSalesCategoriesIdFk: foreignKey({
			columns: [table.categoryId],
			foreignColumns: [salesCategories.id],
			name: "sales_products_category_id_sales_categories_id_fk"
		}),
		salesProductsSkuUnique: unique("sales_products_sku_unique").on(table.sku),
	}
});

export const salesTransactions = pgTable("sales_transactions", {
	id: serial().primaryKey().notNull(),
	transactionNumber: varchar("transaction_number", { length: 50 }).notNull(),
	subtotalAmount: numeric("subtotal_amount", { precision: 12, scale: 2 }).default('0').notNull(),
	discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).default('0').notNull(),
	totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
	paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
	paymentStatus: varchar("payment_status", { length: 20 }).default('PAID').notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		salesTransactionsTransactionNumberUnique: unique("sales_transactions_transaction_number_unique").on(table.transactionNumber),
	}
});

export const salesTransactionItems = pgTable("sales_transaction_items", {
	id: serial().primaryKey().notNull(),
	transactionId: integer("transaction_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
	subtotal: numeric({ precision: 12, scale: 2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		salesTransactionItemsTransactionIdSalesTransactionsIdFk: foreignKey({
			columns: [table.transactionId],
			foreignColumns: [salesTransactions.id],
			name: "sales_transaction_items_transaction_id_sales_transactions_id_fk"
		}),
		salesTransactionItemsProductIdSalesProductsIdFk: foreignKey({
			columns: [table.productId],
			foreignColumns: [salesProducts.id],
			name: "sales_transaction_items_product_id_sales_products_id_fk"
		}),
	}
});
