import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import microConfig from './mikro-orm.config'

const main = async () => {
	// const seed_data = {
	// 	id: 112,
	// 	title: 'my first post', 
	// 	createdAt: new Date(), 
	// 	updatedAt: new Date()
	// }
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up()
	// const post = orm.em.fork({}).create(Post, seed_data)
	// await orm.em.persistAndFlush(post)

	// const posts = await orm.em.find(Post, {})
	// console.log(posts)
}

main().catch(err => {
	console.log(err)
})