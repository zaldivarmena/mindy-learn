"use client"
import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Profile() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <UserProfile routing="hash" />
    </div>
  )
}

export default Profile