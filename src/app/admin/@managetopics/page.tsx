'use client'
import {v4 as uuidv4} from 'uuid';
import { useEffect, useState } from "react";

interface Topic {
  topic_id: string,
  topic: string
}

export default function Page() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [success, setSuccess] = useState(false);
  const [deleteState, setDeleteState] = useState(false);

  useEffect(() => {
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

              setTopics(data.topics);
          } catch (error) {
              console.error(error);
          }
      }

      getData();
  }, []);

  async function createTopic() {
    const postData = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            topic_id: uuidv4(),
            topic: newTopic
        }),
    }

    try {
      await fetch('/api/topic/createtopic', postData);
      setSuccess(true);

      setTimeout(()  => {
        setSuccess(false);
      }, 3000);

      } catch(error) {
          console.error('Error:', error);
      }
}

  async function deleteTopic(id: string, index: number) {
    const queryData = {
      method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic_id: id,
        }),
    }

    const res = await fetch("/api/topic/deletetopic", queryData)

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    setTimeout(()  => {
      setDeleteState(false);
    }, 3000);

    setTopics(prevTopics => {
      const updatedTopics = [...prevTopics];
      updatedTopics.splice(index, 1); // Remove the partner item at the specified index
      return updatedTopics;
    });


    const data = await res.json();

  }



  return(
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-red-500">Topics</h1>
      <form onSubmit={createTopic} className="mb-4">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter new topic"
          className="border border-gray-300 px-4 py-2 rounded-md mr-2 focus:outline-none focus:border-red-500"
        />
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Topic
        </button>
      </form>
      <ul>
        {topics.map((topic, index) => (
          <li key={topic.topic_id} className="flex items-center justify-between mb-2 border-b border-gray-300 py-2">
            <span className="text-lg">{topic.topic}</span>
            <button onClick={() => deleteTopic(topic.topic_id, index)} className="text-red-500 hover:text-red-700 focus:outline-none">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}