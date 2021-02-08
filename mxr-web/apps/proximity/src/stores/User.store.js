import { makeAutoObservable } from 'mobx'
class UserStore {
  accessToken = null
  curOrg = null

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
}

export default new UserStore()
