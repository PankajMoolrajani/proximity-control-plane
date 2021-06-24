import { makeAutoObservable } from 'mobx'

class OrgStore {
  showMenu = false
  userOrgs = null
  constructor() {
    makeAutoObservable(this)
  }

  setUserOrgs(userOrgs) {
    this.userOrgs = userOrgs
  }

  getUserOrgs() {
    return this.userOrgs
  }

  setShowMenu(showMenu) {
    this.showMenu = showMenu
  }

  getShowMenu() {
    return this.showMenu
  }
}

export default new OrgStore()
