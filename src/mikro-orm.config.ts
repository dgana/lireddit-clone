import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path'

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	allowGlobalContext: true,
	user: 'postgres',
	password: 'govindajaya',
	port: 5432,
	entities: [Post],
	dbName: 'lireddit',
	type: 'postgresql',
	debug: !__prod__
} as Parameters<typeof MikroORM.init>[0];