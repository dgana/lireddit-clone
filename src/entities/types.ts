import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { Request, Response } from 'express'
import Express from 'express-session'

export type MyContext = {
	em: EntityManager<IDatabaseDriver<Connection>>
	req: Request & { session?: Express.Session & { userId?: number } }
	res: Response
}