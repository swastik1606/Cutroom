import React from 'react'
import dayjs from 'dayjs'

function Home() {
  const now = dayjs()
  const specificDate = dayjs(now)

  return (
    <main>
      <h1>Welcome to Cutroom</h1>
      <p>{now.format('ddd') + " " + specificDate.format('MMM D, YYYY')}</p>
    </main>
  )
}

export default Home
