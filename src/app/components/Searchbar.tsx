"use client"
import React, { useEffect, useState } from 'react';
import { Filter } from '../types/filter'
import { Sort } from '../types/sort';

interface SearchBarProps {
    params: {
        limit: number,
        offset: number,
        topics: boolean,
        type: string,
        sort: Sort
    },
    onDataReceived: (data: any) => void
}

interface Topic {
    topic_id: string,
    topic: string
}

const SearchBar: React.FC<SearchBarProps> = ({ params, onDataReceived }) => {
    const [init, setInit] = useState<boolean>(true);
    const [searchContent, setSearchContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [topicsList, setTopicsList] = useState<Topic[]>([]);
    const [topics, setTopics] = useState<string[]>([]);

    useEffect(()=> {
        const queryData = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }
          }
            async function getData() {
                try {
                    const res = await fetch("/api/topic/gettopics", queryData);
      
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
      
                    const data = await res.json();
      
                    if (!Array.isArray(data.topics)) {
                        throw new Error('Unexpected data format');
                    }
      
                    setTopicsList(data.topics);
                } catch (error) {
                    console.error(error);
                }
            }
      
            getData();
    }, [])

    useEffect(()=> {
        var arr: string[] = []
        for(let i = 0; i < topicsList.length; i++) {
            arr.push(topicsList[i].topic)
        }

        setTopics(arr);

    }, [topicsList])

    useEffect(() => {
        // Call the onDataReceived function when data changes
        if (data && !init) {
            onDataReceived(data);
        }
    }, [data, onDataReceived]);

    const arrayToString = (array: string[]) => array.join(',');

    const toggleTopic = (topic: string) => {
        setInit(false);
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(item => item !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };

    async function search() {
        setInit(false);
        setLoading(true);
        var newFilters: Filter[] = [];
        console.log(selectedTopics);
        console.log(arrayToString(selectedTopics));
        if(selectedTopics.length > 0) {
            const filter = {
                fieldName: 'topics',
                operator: 'IN',
                fieldValue:  arrayToString(selectedTopics)
            }
            newFilters.push(filter);
        }

        var fn = '';
        if(params.type === 'posts' || params.type === 'research' || params.type === 'projects') {
            fn = 'title'
        }
        else if(params.type ==='partners'|| params.type === 'events') {
            fn = 'name'
        }
        else if(params.type === 'teamleaders') {
            fn = 'leader_name'
        }
        else if(params.type === 'inquiries') {
            fn = 'subj'
        }
        
        const filter = {
            fieldName: fn,
            operator: 'CONTAINS',
            fieldValue: searchContent
        }
        newFilters.push(filter);

        if(newFilters.length > 0) {
            const postData = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: params.limit,
                    offset: params.offset,
                    sort: params.sort,
                    filters: newFilters
                })
            }

            async function getData() {
                try {
                    var res;
                    if(params.type==='posts') {
                        res = await fetch("/api/posts/getposts", postData);
                    }
                    else if(params.type==='research') {
                        res = await fetch("/api/research/getresearchs", postData);
                    }
                    else if(params.type==='projects') {
                        res = await fetch("/api/projects/getprojects", postData);
                    }
                    else if(params.type==='teamleaders') {
                        res = await fetch("/api/teamleaders/getteamleaders", postData);
                    }
                    else if(params.type==='partners') {
                        res = await fetch("/api/partners/getpartners", postData);
                    }
                    else if(params.type==='events') {
                        res = await fetch("/api/events/getevents", postData);
                    }
                    else if(params.type==='inquiries') {
                        res = await fetch("/api/inquiries/getinquiries", postData);
                    }
                    else {
                        res = await fetch("/api/posts/getposts", postData);
                    }
                    
    
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
    
                    const data = await res.json();
                    setData(data);

                } catch (error) {
                    console.error(error);
                }
            }

            getData();
        }
        else {
            setLoading(false);
        }
    }

    return (
        <div className='m-6'>
            <div className="search__input border-[1px] border-solid border-red-500 flex flex-row items-center gap-5 p-1 rounded-[8px]">
                <label 
                    className='pl-2'
                    htmlFor="inputId">
                    <svg fill="#FF0000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.4 488.4">
                        <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
                        s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
                        S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
                        S381.9,104.65,381.9,203.25z"/>
                    </svg>
                </label>
                <input
                    id="inputId"
                    value={searchContent}
                    onChange={(e) => setSearchContent(e.target.value)}
                    placeholder="Search"
                    className=" focus:ring-0 bg-[transparent] outline-none border-none w-full py-3 pr-3 rounded-md focus:outline-none" />
                <button onClick={search} className="m-2 py-2 px-4 rounded bg-red-500 text-white hover:bg-red-700">Search</button>
            </div>
            {params.topics && (
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
            )}
        </div>
    );
}

export default SearchBar;