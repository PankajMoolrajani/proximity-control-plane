import { makeAutoObservable } from 'mobx'

class LayoutStore {
  showMenu = false
  constructor() {
    makeAutoObservable(this)
  }

  setShowMenu(showMenu) {
    this.showMenu = showMenu
  }

  getShowMenu() {
    return this.showMenu
  }
}

export default new LayoutStore()
