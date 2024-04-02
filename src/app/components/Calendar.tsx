'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import {Container} from './Container'
export default function Calendar() {
    return (
        <Container>
        <FullCalendar
            plugins={[ dayGridPlugin ]}
            initialView="dayGridMonth"
            weekends={false}

            events={[
                { title: 'event 1', date: '2024-04-01' },
                { title: 'event 2', date: '2019-04-02' }
            ]}
        />
        </Container>
    )
}