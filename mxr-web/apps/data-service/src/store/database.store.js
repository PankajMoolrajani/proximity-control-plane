import { makeAutoObservable } from 'mobx'

class DatabaseStore {
  isLoading = null
  databases = []
  database = {}

  constructor() {
    makeAutoObservable(this)
  }

  setIsLoading(isLoading) {
    this.isLoading = isLoading
    return this.isLoading
  }

  getIsLoading() {
    return this.isLoading
  }

  setDatabases(databases) {
    this.databases = databases
    return this.databases
  }

  getDatabases() {
    return this.databases
  }

  setDatabase(database) {
    this.database = database
    return this.database
  }

  getDatabase() {
    return this.database
  }

  resetAllFields() {
    this.setIsLoading(false)
    this.setDatabase(null)
    this.setDatabases([])
  }
}

export default new DatabaseStore()
