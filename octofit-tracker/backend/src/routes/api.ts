import { Router } from 'express'
import Activity from '../models/activity.js'
import Leaderboard from '../models/leaderboard.js'
import Team from '../models/team.js'
import User from '../models/user.js'
import Workout from '../models/workout.js'

const router = Router()

router.get('/api/users/', async (_request, response) => {
  response.json(await User.find().select('-passwordHash').lean())
})

router.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'username').lean())
})

router.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().populate('user', 'username').sort({ occurredAt: -1 }).lean())
})

router.get('/api/leaderboard/', async (_request, response) => {
  response.json(
    await Leaderboard.find()
      .populate('user', 'username')
      .populate('team', 'name')
      .sort({ points: -1 })
      .lean(),
  )
})

router.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean())
})

export default router
