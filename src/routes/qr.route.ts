import { Router } from 'express'

const router = Router()

router.post('/start', (req, res) => {
  const { tableId } = req.body

  req.session.tableId = tableId
  req.session.cart = []
  req.session.userInfo = null
  req.session.loggedInUser = null

  return res.json({
    message: 'Session created',
    sessionId: req.sessionID,
    tableId
  })
})

export default router
