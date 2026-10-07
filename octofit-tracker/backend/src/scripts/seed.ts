import mongoose, { Types } from 'mongoose'
import { connectDatabase } from '../config/database.js'
import activity from '../models/activity.js'
import leaderboard from '../models/leaderboard.js'
import team from '../models/team.js'
import user from '../models/user.js'
import workout from '../models/workout.js'

const ids = {
  users: [
    new Types.ObjectId('650000000000000000000001'),
    new Types.ObjectId('650000000000000000000002'),
    new Types.ObjectId('650000000000000000000003'),
    new Types.ObjectId('650000000000000000000004'),
  ],
  teams: [
    new Types.ObjectId('650000000000000000000011'),
    new Types.ObjectId('650000000000000000000012'),
  ],
  activities: [
    new Types.ObjectId('650000000000000000000021'),
    new Types.ObjectId('650000000000000000000022'),
    new Types.ObjectId('650000000000000000000023'),
    new Types.ObjectId('650000000000000000000024'),
  ],
  leaderboard: [
    new Types.ObjectId('650000000000000000000031'),
    new Types.ObjectId('650000000000000000000032'),
    new Types.ObjectId('650000000000000000000033'),
    new Types.ObjectId('650000000000000000000034'),
  ],
  workouts: [
    new Types.ObjectId('650000000000000000000041'),
    new Types.ObjectId('650000000000000000000042'),
    new Types.ObjectId('650000000000000000000043'),
  ],
}

/**
 * Seed the octofit_db database with test data.
 */
async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase()

    await Promise.all([
      user.deleteMany({ _id: { $in: ids.users } }),
      team.deleteMany({ _id: { $in: ids.teams } }),
      activity.deleteMany({ _id: { $in: ids.activities } }),
      leaderboard.deleteMany({ _id: { $in: ids.leaderboard } }),
      workout.deleteMany({ _id: { $in: ids.workouts } }),
    ])

    const users = await user.insertMany([
      {
        _id: ids.users[0],
        username: 'alex-morgan',
        email: 'alex.morgan@example.com',
        passwordHash: 'seed-only-not-a-valid-password-hash',
      },
      {
        _id: ids.users[1],
        username: 'jamie-chen',
        email: 'jamie.chen@example.com',
        passwordHash: 'seed-only-not-a-valid-password-hash',
      },
      {
        _id: ids.users[2],
        username: 'taylor-rivera',
        email: 'taylor.rivera@example.com',
        passwordHash: 'seed-only-not-a-valid-password-hash',
      },
      {
        _id: ids.users[3],
        username: 'sam-patel',
        email: 'sam.patel@example.com',
        passwordHash: 'seed-only-not-a-valid-password-hash',
      },
    ])

    const teams = await team.insertMany([
      {
        _id: ids.teams[0],
        name: 'Morning Movers',
        description: 'A friendly team for early workouts.',
        members: [ids.users[0], ids.users[1]],
      },
      {
        _id: ids.teams[1],
        name: 'Weekend Warriors',
        description: 'Building consistency one weekend at a time.',
        members: [ids.users[2], ids.users[3]],
      },
    ])

    const activities = await activity.insertMany([
      {
        _id: ids.activities[0],
        user: ids.users[0],
        activityType: 'run',
        durationMinutes: 32,
        distanceKm: 5.2,
        calories: 380,
        occurredAt: new Date('2026-10-03T07:30:00.000Z'),
      },
      {
        _id: ids.activities[1],
        user: ids.users[1],
        activityType: 'cycling',
        durationMinutes: 45,
        distanceKm: 16.4,
        calories: 420,
        occurredAt: new Date('2026-10-04T08:00:00.000Z'),
      },
      {
        _id: ids.activities[2],
        user: ids.users[2],
        activityType: 'strength',
        durationMinutes: 40,
        calories: 290,
        occurredAt: new Date('2026-10-04T16:00:00.000Z'),
      },
      {
        _id: ids.activities[3],
        user: ids.users[3],
        activityType: 'walk',
        durationMinutes: 55,
        distanceKm: 4.1,
        calories: 230,
        occurredAt: new Date('2026-10-05T09:15:00.000Z'),
      },
    ])

    const leaderboardEntries = await leaderboard.insertMany([
      { _id: ids.leaderboard[0], user: ids.users[0], team: ids.teams[0], points: 380 },
      { _id: ids.leaderboard[1], user: ids.users[1], team: ids.teams[0], points: 420 },
      { _id: ids.leaderboard[2], user: ids.users[2], team: ids.teams[1], points: 290 },
      { _id: ids.leaderboard[3], user: ids.users[3], team: ids.teams[1], points: 230 },
    ])

    const workouts = await workout.insertMany([
      {
        _id: ids.workouts[0],
        name: 'Beginner Full-Body Circuit',
        description: 'A balanced circuit covering the major muscle groups.',
        difficulty: 'beginner',
        durationMinutes: 25,
        equipment: ['exercise mat'],
      },
      {
        _id: ids.workouts[1],
        name: 'Tempo Run',
        description: 'A steady-paced run to build cardiovascular endurance.',
        difficulty: 'intermediate',
        durationMinutes: 35,
        equipment: [],
      },
      {
        _id: ids.workouts[2],
        name: 'Advanced Strength Intervals',
        description: 'A challenging interval session combining strength and conditioning.',
        difficulty: 'advanced',
        durationMinutes: 45,
        equipment: ['dumbbells', 'exercise mat'],
      },
    ])

    console.log(
      `Database seeding complete: ${users.length} users, ${teams.length} teams, ` +
        `${activities.length} activities, ${leaderboardEntries.length} leaderboard entries, ` +
        `${workouts.length} workouts.`,
    )
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('Error seeding database:', error)
  process.exitCode = 1
})
