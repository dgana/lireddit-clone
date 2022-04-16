import DataLoader from 'dataloader'
import { In } from 'typeorm'
import { Updoot } from '../entities/Updoot'

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value:1}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findBy({
        userId: In(keys.map((x) => x.userId)),
        postId: In(keys.map((x) => x.postId))
      })

      const updootIdsToUpdoot: Record<string, Updoot> = {}
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot
      })

      return keys.map((key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`])
    }
  )