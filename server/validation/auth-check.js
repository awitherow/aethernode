import { decodeToken } from '../queries/auth'
import { getUser } from '../queries/user'

module.exports = (req, res, next) => {
  if (!(req.query && req.query.token)) {
    return res.status(400).json({
      status: 'Please log in',
    })
  }

  return decodeToken(req.query.token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: 'Token has expired',
      })  
    } else {
      return getUser(req.query.username).then(user => {
        if (!user || payload.sub !== user.id) {
          return res.status(400).json({
            status: 'Please log in',
          })
        } else {
          next()
        }
      })
    }
  })
}