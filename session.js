import uuid from 'uuid/v4'
import moment from 'moment'

class Session {
  constructor () {
    this._session = {}
  }

  createNewSession = (userData) => {
    const sessionId = uuid()
    this._session[sessionId] = {
      ...userData,
      expiry: moment().day(7)
    }
    return sessionId
  }

  endSession = (sessionId) => {
    delete this._session[sessionId]
  }

  checkValid = (sessionId) => {
    const sessionInfo = this._session[sessionId]
    if (sessionInfo) {
      if (sessionInfo.expiry > moment()) {
        return true
      }
      this.endSession(sessionId)
    }
    return false
  }

  getUserDataFromSession = (sessionId) => {
    return this._session[sessionId]
  }
}

export default Session
