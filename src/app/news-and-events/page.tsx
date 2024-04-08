import React from 'react'
import Calendar from '../components/Calendar'
import executeQuery from '../lib/db'
import { Event } from '../types/event'

export default async function NewsPage() {
  return (
      <Calendar/>
  )
}