import { makeAutoObservable } from 'mobx'

class RelationStore {
  isLoading = null
  query = {}
  total = null
  relations = []
  relation = {}

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

  setRelations(relations) {
    this.relations = relations
    return this.relations
  }

  getRelations() {
    return this.relations
  }

  setRelation(relation) {
    this.relation = relation
    return this.relation
  }

  getRelation() {
    return this.relation
  }

  resetAllFields() {
    this.setIsLoading(false)
    this.setQuery(null)
    this.setTotal(null)
    this.setRelation(null)
    this.setRelations([])
  }
}

export default new RelationStore()
