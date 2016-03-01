
exports.up = function(knex, Promise) {
	return Promise.all([


		knex.schema.createTable("clients", function(table) {
			table.increments("cid").primary();

			table.string("first");
			table.string("middle");
			table.string("last");

			table.string("gender");
			table.timestamp("dob");

			table.string("phone");
			table.string("email");
			table.string("address");

			table.string("charge_lvl");

			table.string("offense_1");
			table.string("offense_2");
			table.string("offense_3");

			table.boolean("warrant");
			table.string("case_num");
			table.string("so");
			table.string("otn");

			table.string("notes");

			table.string("officer_id");
			table.string("police_dept");

			table.boolean("accepted");
			table.boolean("processed").defaultTo(false);

			table.timestamp("updated");
			table.timestamp("created").defaultTo(knex.fn.now());
		}),

		knex.schema.createTable("charge_lvl_stats", function(table) {

			table.string("type");
			table.boolean("warrant").defaultTo(false);
			table.boolean("allowed").defaultTo(false);

			table.timestamp("updated");
		}),

		knex.schema.createTable("jail_levels", function(table) {

			table.string("ocr_m");
			table.string("ocr_f");

			table.timestamp("updated");
		}),

		knex.schema.createTable("admins", function(table) {
			table.increments("aid").primary();

			table.string("name");
			table.string("pass");
			table.string("email");
			
			table.boolean("cjs_perms").defaultTo(false);
			table.boolean("jail_perms").defaultTo(false);
			table.boolean("super").defaultTo(false);

			table.timestamp("updated");
		})

	])
};

exports.down = function(knex, Promise) {
	return Promise.all([

		knex.schema.dropTable("clients"),
		knex.schema.dropTable("charge_lvl_stats"),
		knex.schema.dropTable("jail_levels"),
		knex.schema.dropTable("admins")

	])
};
