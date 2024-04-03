'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {Container} from './Container'
import {useState, useEffect} from 'react'

function useTransformedEvents(initialEvents: unknown) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // @ts-ignore
        const transformedEvents = initialEvents.map((eventData: { event_id: any; title: any; event_start: any; event_end: any; }) => {
            return {
                id: eventData.event_id,
                title: eventData.title,
                start: eventData.event_start,
                end: eventData.event_end,
            };
        });

        setEvents(transformedEvents);
    }, [initialEvents]);

    return events;
}
export default function Calendar() {
    const [initialEvents, setInitialEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events/getevents')
            .then(response => response.json())
            .then(data => setInitialEvents(data.events)); // Change this line
    }, []);

    const events = useTransformedEvents(initialEvents);

    return (
        <Container>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={events}
            />
        </Container>
    );
}