import { makeAutoObservable } from 'mobx'
class UserStore {
  accessToken = null
  curOrg = null
  user = null

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

  setCurOrg(curOrg) {
    this.curOrg = curOrg
    return this.curOrg
  }

  getCurOrg() {
    return this.curOrg
  }

  setUser(user) {
    this.user = user
    return this.user
  }

  getUser() {
    return this.user
  }
}

export default new UserStore()
