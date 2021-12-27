import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

// fetchOrganizations()
// This endpoint will fetch all of our organizations
// from our database and place them into an array
// where we can display them using the organizationCard(),
// and listOrganizations()

export default async function fetchUserOrgs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    const creatorOrganization = await db
      .collection('organizations')
      .find({ organizerId: new mongodb.ObjectId(session.user.id) })
      .sort({ organizationName: 1 })
      .toArray()

    const adminOrganizations = await db
      .collection('organizations')
      .find({
        superMembersList: {
          $elemMatch: { adminId: new mongodb.ObjectId(session.user.id) },
        },
      })
      .sort({ organizationName: 1 })
      .toArray()

    const memberOrganizations = await db
      .collection('organizations')
      .find({
        membersList: {
          $elemMatch: { memberId: new mongodb.ObjectId(session.user.id) },
        },
      })
      .sort({ organizationName: 1 })
      .toArray()
    res
      .status(200)
      .json({ creatorOrganization, adminOrganizations, memberOrganizations })
  } else {
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}