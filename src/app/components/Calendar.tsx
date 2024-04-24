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
    const [openEvent, setOpenEvent] = useState(false);
    const [eventName, setEventName] = useState('');
    const [link, setLink] = useState('');
    const [content, setContent] = useState('')
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    
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
        const startDate = new Date(eventObj.start).toLocaleString();
        const endDate = new Date(eventObj.end).toLocaleString();

        if (eventObj.url) {
            setOpenEvent(!openEvent);
            setEventName(eventObj.title);
            setLink(eventObj.url);
            setContent(eventObj.extendedProps.content);
            setStart(startDate);
            setEnd(endDate);
        }
    }
    return (
        <div className="flex">
            <Container className="w-3/4">
                <FullCalendar
                    plugins={[ dayGridPlugin ]}
                    initialView="dayGridMonth"
                    events={events}
                    //@ts-ignore
                    eventClick={handleEventClick}
                />
            </Container>
            {openEvent && (
                <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
                <div className="z-10 w-1/3 p-4">
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-bold mb-4">{eventName}</h2>
                        <div className="mb-2">
                            <span className="font-semibold">Link:</span> {link}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Content:</span> {content}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Start:</span> {start}
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">End:</span> {end}
                        </div>
                        <button onClick={() => setOpenEvent(!openEvent)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600">Close</button>
                    </div>
                </div>
            </div>
            
           
           
            )}
        </div>
    )
}