import { makeAutoObservable } from 'mobx'

class CollectionStore {
  isLoading = null
  query = {}
  total = null
  collections = []
  collection = {}

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

  setQuery(query) {
    this.query = query
    return this.query
  }

  getQuery() {
    return this.query
  }

  setTotal(total) {
    this.total = total
    return this.total
  }

  getTotal() {
    return this.total
  }

  setCollections(collections) {
    this.collections = collections
    return this.collections
  }

  getCollections() {
    return this.collections
  }

  setCollection(collection) {
    this.collection = collection
    return this.collection
  }

  getCollection() {
    return this.collection
  }
}

export default new CollectionStore()
