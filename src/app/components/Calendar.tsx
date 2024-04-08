"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {Container} from './Container'

export default function Calendar({events}: {events: any}) {
    const handleEventClick = (clickInfo: { event: { extendedProps: { html: string | URL | undefined } } }) => {
        window.open(clickInfo.event.extendedProps.html, '_blank');
    }

    return (
        <Container>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={events}
                //@ts-ignore
                eventClick={handleEventClick}
            />
        </Container>
    );
}