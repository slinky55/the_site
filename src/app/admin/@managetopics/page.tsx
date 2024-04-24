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
    <div>
      <h1>Topics</h1>
      <form onSubmit={createTopic}>
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter new topic"
        />
        <button type="submit">Create Topic</button>
      </form>
      <div>
        {topics.map((topic, index) => (
          <li key={topic.topic_id}>
            {topic.topic}
            <button onClick={() => deleteTopic(topic.topic_id, index)}>Delete</button>
          </li>
        ))}
      </div>
    </div>
  );
}