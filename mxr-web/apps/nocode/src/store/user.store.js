import { makeAutoObservable } from 'mobx'
class UserStore {
  accessToken = null

  constructor() {
    makeAutoObservable(this)
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken
    return this.accessToken
  }

  getAccessToken() {
    return this.accessToken
  }
}

export default new UserStore()
