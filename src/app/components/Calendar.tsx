"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import {Container} from './Container'
import {useState, useEffect, useMemo} from 'react'
import { Sort } from '../types/sort'

function useTransformedEvents(initialEvents: unknown) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // @ts-ignore
        const transformedEvents = initialEvents.map((eventData: { event_id: any; name: any; event_start: any; event_end: any; reg_link: any; content: any; }) => {
            return {
                id: eventData.event_id,
                title: eventData.name,
                content: eventData.content,
                start: new Date(eventData.event_start).toISOString(),
                end: new Date(eventData.event_end).toISOString(),
                url: eventData.reg_link,
            };
        });

        setEvents(transformedEvents);
    }, [initialEvents]);

    return events;
}

export default function Calendar() {
    const [initialEvents, setInitialEvents] = useState([]);
    const sort: Sort = {
        fieldName: 'event_start',
        direction: 'DESC'
    }
    const eventData = useMemo(() => ({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            limit: 1000,
            offset: 0,
            sort: sort,
            filters: []
        })
    }), []);
    useEffect(() => {
        fetch('/api/events/getevents', eventData)
            .then(response => response.json())
            .then(data => {
                console.log(data.events);
                setInitialEvents(data.events)
            });
    }, [eventData]);

    const events = useTransformedEvents(initialEvents);

    const handleEventClick = (clickInfo: { event: { title: string; url: string | undefined; extendedProps: { content: string }; start: Date; end: Date }; jsEvent: MouseEvent}) => {
        clickInfo.jsEvent.preventDefault();
        const eventObj = clickInfo.event;
        const startDate = new Date(eventObj.start).toLocaleDateString();
        const endDate = new Date(eventObj.end).toLocaleDateString();

        if (eventObj.url) {
            const userConfirmation = window.confirm(
                'Event Name: ' + eventObj.title + '\n' +
                'Start Date: ' + startDate + ' ' +
                'End Date: ' + endDate + '\n' +
                'Registration Link: ' + eventObj.url + '\n' +
                'Information: ' + eventObj.extendedProps.content + '\n\n' +
                'Would you like to open the registration link?'
            );
            if (userConfirmation) {
                window.open(eventObj.url, '_blank');
            }
        }
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
    )
}