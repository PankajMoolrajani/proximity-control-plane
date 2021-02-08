import { makeAutoObservable, observable, toJS } from 'mobx'

class LayoutStore {
  constructor() {
    let showMenu = null
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
