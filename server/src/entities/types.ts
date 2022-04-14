import { Request, Response } from 'express'
import Express from 'express-session'
import { Redis } from 'ioredis'

export type MyContext = {
  req: Request & { session?: Express.Session & { userId?: number } }
  res: Response
  redis: Redis
}
