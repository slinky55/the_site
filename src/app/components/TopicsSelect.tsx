"use client"
import React, { useEffect, useState } from 'react';
import { Filter } from '../types/filter'

export default function TopicsSelect() {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health"]

    const arrayToString = (array: string[]) => array.join(', ');

    const toggleTopic = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(item => item !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    return (
        <div className="flex flex-wrap">
            {topics.map((topic, index) => (
                <button
                key={index}
                className={`m-2 py-2 px-4 rounded ${selectedTopics.includes(topic) ? 'bg-red-500 text-white' : 'border border-red-500 bg-transparent text-red-500'}`}
                onClick={() => toggleTopic(topic)}
                >
                    {topic}
                </button>
            ))}
            <button
                className={`m-2 py-2 px-4 rounded ${selectedTopics.length === topics.length ? 'bg-red-500 text-white' : 'border border-red-500 bg-transparent text-red-500'}`}
                onClick={() => {
                    if (selectedTopics.length === topics.length) {
                        setSelectedTopics([]);
                    } else {
                        setSelectedTopics([...topics]);
                    }
                }}
            >
                {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
            </button>
        </div>
    );
}





