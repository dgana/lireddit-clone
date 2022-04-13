import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import { MyContext } from "./entities/types"
import session from "express-session"
import connectRedis from 'connect-redis'
import { createClient } from "redis"

const RedisStore = connectRedis(session)
const redisClient = createClient({ legacyMode: true })

const main = async () => {
	await redisClient.connect().catch(console.error)
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up()

	const app = express()

	/** 
	 * Problem of Cookie not shown/stored in the browser Apollo
	 * @see https://community.apollographql.com/t/cookie-not-shown-stored-in-the-browser/1901/3 
	 */
	app.set('trust proxy', !__prod__)

	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ 
				client: redisClient,  
				disableTouch: true
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
				httpOnly: true,
				sameSite: 'none', // csrf
				secure: true // cookie only works in https
			},
			saveUninitialized: false, // create a session by default with no data
			secret: "qwertypoiuy",
			resave: false,
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false
		}),
		context: ({ req, res }): MyContext => ({ 
			em: orm.em, 
			req, 
			res
		})
	})

	await apolloServer.start()

	apolloServer.applyMiddleware({ 
		app,
		cors: {
			origin: 'http://localhost:3000',
      credentials: true,		
		}
	})

	app.listen(4000, () => {
		console.log('server started on localhost:4000')
	})
}

main().catch(err => {
	console.log(err)
})