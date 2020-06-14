import { db, Models } from '@/core/db'

declare global {
  type ModelNames = keyof typeof Models
  type Db = typeof db

  const $db: Db

  namespace NodeJS {
    interface Global {
      __$db: Db
    }
  }
}
