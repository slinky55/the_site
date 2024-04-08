import React from 'react'
import Calendar from '../components/Calendar'
import executeQuery from '../lib/db'
import { Event } from '../types/event'

export default async function NewsPage() {
  try {
    const res = await executeQuery({
      query: 'SELECT * FROM Event',
      values: '',
    });

    const events = res.map((evt: Event) => {
      return {...evt}
    })

    return (
      <>
        <div>
          <Calendar events={events}/>
        </div>
      </>
    )
  } catch (e) {
    console.log(e);
    return (
      <>
        <div>
          <Calendar events={[]}/>
        </div>
      </>
    )
  }
}