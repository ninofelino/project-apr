-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."perumahan_attendance_type" AS ENUM('CLOCK_IN', 'CLOCK_OUT');--> statement-breakpoint
CREATE TYPE "public"."perumahan_invoice_status" AS ENUM('PENDING', 'PAID', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."perumahan_role" AS ENUM('ADMIN', 'MANAGER', 'SALESMAN');--> statement-breakpoint
CREATE TYPE "public"."perumahan_status" AS ENUM('AVAILABLE', 'SOLD', 'RESERVED');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"prompt" text NOT NULL,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"phone" varchar(20),
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"business_name" varchar(255),
	"business_type" varchar(100),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fish_auctions" (
	"id" serial PRIMARY KEY NOT NULL,
	"seller_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"starting_price" numeric(10, 2) NOT NULL,
	"current_price" numeric(10, 2) NOT NULL,
	"highest_bidder_id" integer,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auction_bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"auction_id" integer NOT NULL,
	"bidder_id" integer NOT NULL,
	"bid_amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fish_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_fish_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"fish_category_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"market_name" varchar(255),
	"price_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fish_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_id" integer,
	"seller_id" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"unit" varchar(50) NOT NULL,
	"stock" integer DEFAULT 0,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "umkm_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"seller_id" integer NOT NULL,
	"category" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playing_with_neon" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"value" real
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "warehouse_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(50) NOT NULL,
	"barcode" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"min_stock" integer DEFAULT 10 NOT NULL,
	"unit" varchar(50) DEFAULT 'pcs' NOT NULL,
	"location" varchar(100),
	"supplier" varchar(255),
	"cost_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"selling_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "warehouse_items_sku_key" UNIQUE("sku"),
	CONSTRAINT "warehouse_items_barcode_key" UNIQUE("barcode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer,
	"type" varchar(20) NOT NULL,
	"quantity" integer NOT NULL,
	"previous_quantity" integer NOT NULL,
	"new_quantity" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"reference" varchar(100),
	"performed_by" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "stock_transactions_type_check" CHECK ((type)::text = ANY ((ARRAY['in'::character varying, 'out'::character varying, 'adjustment'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"table_number" integer NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"payment_method" varchar(50),
	"payment_status" varchar(50) DEFAULT 'pending',
	"served_by" varchar(50),
	"handled_by_kitchen" varchar(50),
	"processed_by_cashier" varchar(50),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"taxable_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"pb1_rate" numeric(5, 2) DEFAULT '10' NOT NULL,
	"pb1_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"service_charge_rate" numeric(5, 2) DEFAULT '5' NOT NULL,
	"service_charge_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_before_tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"pph_final_rate" numeric(5, 4) DEFAULT '0.5' NOT NULL,
	"pph_final_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	CONSTRAINT "restaurant_orders_order_number_key" UNIQUE("order_number"),
	CONSTRAINT "restaurant_orders_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'cooking'::character varying, 'ready'::character varying, 'served'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])),
	CONSTRAINT "restaurant_orders_payment_status_check" CHECK ((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'refunded'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"role" varchar(50) NOT NULL,
	"pin" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "restaurant_staff_nip_key" UNIQUE("nip"),
	CONSTRAINT "restaurant_staff_email_key" UNIQUE("email"),
	CONSTRAINT "restaurant_staff_role_check" CHECK ((role)::text = ANY ((ARRAY['pramusaji'::character varying, 'dapur'::character varying, 'kasir'::character varying, 'manager'::character varying])::text[])),
	CONSTRAINT "restaurant_staff_status_check" CHECK ((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'on_leave'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"menu_item_id" integer,
	"menu_item_name" varchar(255) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "restaurant_order_items_status_check" CHECK ((status)::text = ANY ((ARRAY['pending'::character varying, 'cooking'::character varying, 'ready'::character varying, 'served'::character varying, 'cancelled'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"prep_time" integer DEFAULT 15 NOT NULL,
	"available" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "restaurant_menu_items_sku_key" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"nip" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"department" varchar(100) NOT NULL,
	"position" varchar(100) NOT NULL,
	"salary" numeric(12, 2) DEFAULT '0' NOT NULL,
	"join_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"address" text,
	"emergency_contact" varchar(255),
	"emergency_phone" varchar(20),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "employees_nip_key" UNIQUE("nip"),
	CONSTRAINT "employees_email_key" UNIQUE("email"),
	CONSTRAINT "employees_status_check" CHECK ((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'on_leave'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurant_tables" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_number" integer NOT NULL,
	"capacity" integer NOT NULL,
	"section" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"current_order_id" integer,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"description" text,
	"image" text,
	CONSTRAINT "restaurant_tables_table_number_key" UNIQUE("table_number"),
	CONSTRAINT "restaurant_tables_status_check" CHECK ((status)::text = ANY ((ARRAY['available'::character varying, 'occupied'::character varying, 'reserved'::character varying, 'maintenance'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" numeric(10, 4) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"effective_date" date DEFAULT CURRENT_DATE,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "tax_configurations_config_key_key" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_period" date NOT NULL,
	"report_type" varchar(50) NOT NULL,
	"total_revenue" numeric(15, 2) NOT NULL,
	"total_pb1_collected" numeric(15, 2) NOT NULL,
	"total_service_charge_collected" numeric(15, 2) NOT NULL,
	"total_pph_final" numeric(15, 2) NOT NULL,
	"taxable_transactions" integer NOT NULL,
	"status" varchar(50) DEFAULT 'draft',
	"submitted_date" date,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "microcontrollers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"family" varchar(100) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"specs" jsonb NOT NULL,
	"price" numeric(10, 2),
	"stock" integer DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "arduino_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"code" text NOT NULL,
	"category" varchar(100),
	"difficulty" varchar(20) DEFAULT 'beginner',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sensor_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"temperature" numeric(5, 2) NOT NULL,
	"humidity" numeric(5, 2) NOT NULL,
	"timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
	"device_id" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iot_sensors" (
	"id" serial PRIMARY KEY NOT NULL,
	"pond_id" integer NOT NULL,
	"device_id" varchar(100) NOT NULL,
	"sensor_type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"last_reading" numeric(10, 2),
	"unit" varchar(20),
	"installed_at" timestamp DEFAULT now(),
	"last_maintenance" timestamp,
	"next_maintenance" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "iot_sensors_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"address" text,
	"total_orders" integer DEFAULT 0,
	"total_spent" numeric(12, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"unit" varchar(20) NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"customer_phone" varchar(20),
	"customer_address" text,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_status" varchar(20) DEFAULT 'unpaid' NOT NULL,
	"payment_method" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"transaction_id" varchar(255),
	"payment_proof" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pond_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"pond_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10, 2),
	"unit" varchar(20),
	"notes" text,
	"image_url" text,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sensor_readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"pond_id" integer NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"unit" varchar(20) NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"reference_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ponds" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"size" numeric(10, 2) NOT NULL,
	"depth" numeric(10, 2),
	"capacity" integer,
	"current_stock" integer DEFAULT 0,
	"fish_type" varchar(100),
	"image_url" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"location" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "iot_controls" (
	"id" serial PRIMARY KEY NOT NULL,
	"pond_id" integer NOT NULL,
	"device_id" varchar(100) NOT NULL,
	"control_type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'off' NOT NULL,
	"last_activated" timestamp,
	"schedule" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" numeric(12, 2) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"metric_data" jsonb NOT NULL,
	"period" varchar(20) NOT NULL,
	"calculated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" numeric(12, 2) NOT NULL,
	"min_quantity" numeric(12, 2) NOT NULL,
	"location" varchar(255),
	"last_restocked" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"inventory_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"quantity" numeric(12, 2) NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"category" varchar(100) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"reference_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "training_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"content_type" varchar(20) NOT NULL,
	"content_url" text,
	"content" text,
	"image_url" text,
	"author" varchar(255),
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_training_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"material_id" integer NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"progress" integer DEFAULT 0,
	"last_accessed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "favorite_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"description" text,
	"category" varchar(100),
	"tags" jsonb,
	"method" varchar(10) DEFAULT 'GET',
	"headers" jsonb,
	"body" jsonb,
	"is_api" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorite_urls_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#3B82F6',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection_id" integer NOT NULL,
	"prompt_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(20) DEFAULT 'music' NOT NULL,
	"category" varchar(100),
	"tags" text[] DEFAULT '{""}',
	"description" text,
	"genre" varchar(100),
	"mood" varchar(100),
	"tempo" varchar(50),
	"instruments" text[] DEFAULT '{""}',
	"style" varchar(100),
	"duration" varchar(50),
	"resolution" varchar(50),
	"is_favorite" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"last_used" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" text NOT NULL,
	"name" text,
	"description" text,
	"context_length" integer,
	"max_completion_tokens" integer,
	"pricing_prompt" text DEFAULT '0',
	"pricing_completion" text DEFAULT '0',
	"is_free" boolean DEFAULT true NOT NULL,
	"architecture" text,
	"supported_parameters" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "models_model_id_key" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"model_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "myprompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"model" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perumahan_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"role" "perumahan_role" DEFAULT 'SALESMAN' NOT NULL,
	"region_id" uuid,
	CONSTRAINT "perumahan_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perumahan_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"type" "perumahan_attendance_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perumahan_regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "perumahan_regions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perumahan_houses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"region_id" uuid NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"status" "perumahan_status" DEFAULT 'AVAILABLE' NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perumahan_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salesman_id" uuid NOT NULL,
	"house_id" uuid NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"status" "perumahan_invoice_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fish_auctions" ADD CONSTRAINT "fish_auctions_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fish_auctions" ADD CONSTRAINT "fish_auctions_product_id_fish_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."fish_products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fish_auctions" ADD CONSTRAINT "fish_auctions_highest_bidder_id_users_id_fk" FOREIGN KEY ("highest_bidder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auction_id_fish_auctions_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."fish_auctions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_bidder_id_users_id_fk" FOREIGN KEY ("bidder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_fish_prices" ADD CONSTRAINT "daily_fish_prices_fish_category_id_fish_categories_id_fk" FOREIGN KEY ("fish_category_id") REFERENCES "public"."fish_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fish_products" ADD CONSTRAINT "fish_products_category_id_fish_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."fish_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fish_products" ADD CONSTRAINT "fish_products_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "umkm_products" ADD CONSTRAINT "umkm_products_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."warehouse_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_orders" ADD CONSTRAINT "restaurant_orders_processed_by_cashier_fkey" FOREIGN KEY ("processed_by_cashier") REFERENCES "public"."restaurant_staff"("nip") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_orders" ADD CONSTRAINT "restaurant_orders_served_by_fkey" FOREIGN KEY ("served_by") REFERENCES "public"."restaurant_staff"("nip") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_orders" ADD CONSTRAINT "restaurant_orders_handled_by_kitchen_fkey" FOREIGN KEY ("handled_by_kitchen") REFERENCES "public"."restaurant_staff"("nip") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_order_items" ADD CONSTRAINT "restaurant_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."restaurant_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurant_order_items" ADD CONSTRAINT "restaurant_order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "public"."restaurant_menu_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iot_sensors" ADD CONSTRAINT "iot_sensors_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pond_activities" ADD CONSTRAINT "pond_activities_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pond_activities" ADD CONSTRAINT "pond_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_sensor_id_iot_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."iot_sensors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ponds" ADD CONSTRAINT "ponds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "iot_controls" ADD CONSTRAINT "iot_controls_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_metrics" ADD CONSTRAINT "analytics_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_training_progress" ADD CONSTRAINT "user_training_progress_material_id_training_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."training_materials"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_training_progress" ADD CONSTRAINT "user_training_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_prompts" ADD CONSTRAINT "collection_prompts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_prompts" ADD CONSTRAINT "collection_prompts_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perumahan_users" ADD CONSTRAINT "perumahan_users_region_id_perumahan_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."perumahan_regions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perumahan_attendance" ADD CONSTRAINT "perumahan_attendance_user_id_perumahan_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."perumahan_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perumahan_houses" ADD CONSTRAINT "perumahan_houses_region_id_perumahan_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."perumahan_regions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perumahan_invoices" ADD CONSTRAINT "perumahan_invoices_salesman_id_perumahan_users_id_fk" FOREIGN KEY ("salesman_id") REFERENCES "public"."perumahan_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perumahan_invoices" ADD CONSTRAINT "perumahan_invoices_house_id_perumahan_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."perumahan_houses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_warehouse_items_barcode" ON "warehouse_items" USING btree ("barcode" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_warehouse_items_category" ON "warehouse_items" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stock_transactions_created_at" ON "stock_transactions" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_stock_transactions_item_id" ON "stock_transactions" USING btree ("item_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_payment" ON "restaurant_orders" USING btree ("payment_status" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "restaurant_orders" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_table" ON "restaurant_orders" USING btree ("table_number" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_staff_role" ON "restaurant_staff" USING btree ("role" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_staff_status" ON "restaurant_staff" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_menu_items_available" ON "restaurant_menu_items" USING btree ("available" bool_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_menu_items_category" ON "restaurant_menu_items" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_employees_department" ON "employees" USING btree ("department" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_employees_email" ON "employees" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_employees_nip" ON "employees" USING btree ("nip" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_employees_status" ON "employees" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tables_section" ON "restaurant_tables" USING btree ("section" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tables_status" ON "restaurant_tables" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tax_config_key" ON "tax_configurations" USING btree ("config_key" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_tax_reports_period" ON "tax_reports" USING btree ("report_period" date_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "unique_collection_prompt" ON "collection_prompts" USING btree ("collection_id" int4_ops,"prompt_id" int4_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_idx" ON "prompts" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "favorite_idx" ON "prompts" USING btree ("is_favorite" bool_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_idx" ON "prompts" USING btree ("tags" array_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "type_idx" ON "prompts" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_models_model_id" ON "models" USING btree ("model_id" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chats_updated" ON "chats" USING btree ("updated_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_messages_chat_id" ON "messages" USING btree ("chat_id" uuid_ops);
*/