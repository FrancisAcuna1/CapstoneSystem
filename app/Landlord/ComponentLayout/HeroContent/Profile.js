'use client'

import { UserButton } from '@clerk/nextjs'

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

const CustomPage = () => {
  return (
    <div>
      <h1>Custom Profile Page</h1>
      <p>This is the custom profile page</p>
    </div>
  )
}

export default function Home() {
  return (
    <header>
      <UserButton>
        <UserButton.UserProfilePage label="Custom Page" url="custom" labelIcon={<DotIcon />}>
          <CustomPage />
        </UserButton.UserProfilePage>
        <UserButton.UserProfileLink label="Homepage" url="/" labelIcon={<DotIcon />} />
        <UserButton.UserProfilePage label="account" />
        <UserButton.UserProfilePage label="security" />
      </UserButton>
    </header>
  )
}