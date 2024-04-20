'use client'
import React, { useEffect, useState } from 'react';
import { Post } from '../types/post';
import { useRouter } from 'next/navigation';
import { Div } from '../types/div';
import Image from 'next/image';

export default function BlogPage() {
    const [images, setImages] = useState<any[]>([]);
    const [divs, setDivs] = useState<Div[]>([]);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();
    const limit = 10;

    useEffect(() => {
        const postData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit: limit,
                offset: 0
            })
        }

        async function getData() {
            try {
                const res = await fetch("/api/posts/getposts", postData);

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                setPosts(data.posts);

                // Fetch user data for each post
                const users = await Promise.all(data.posts.map(async (post: { user_id: any; }) => {
                    const userRes = await fetch(`/api/users/getusers`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: post.user_id })
                    });
                    if (!userRes.ok) {
                        throw new Error(`HTTP error! Status: ${userRes.status}`);
                    }
                    return userRes.json();
                }));

                setUsers(users);

            } catch (error) {
                console.error(error);
                setError('Failed to load data');
            }
        }
        const queryData = {
            method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                page: 'blog',
                limit: 1000,
                offset: 0,
              })
          }
          async function getImgs() {
              try {
                  const res = await fetch("/api/images/getimages", queryData);
      
                  if (!res.ok) {
                      throw new Error(`HTTP error! Status: ${res.status}`);
                  }
      
                  const data = await res.json();
      
                  if (!Array.isArray(data.images)) {
                      throw new Error('Unexpected data format');
                  }
      
                  setImages(data.images);
              } catch (error) {
                  console.error(error);
              } 
          }
          async function getDivs() {
            try {
                const res = await fetch("/api/divs/getdivs", queryData);
      
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
      
                const data = await res.json();
      
                if (!Array.isArray(data.divs)) {
                    throw new Error('Unexpected data format');
                }
      
                setDivs(data.divs);
            } catch (error) {
                console.error(error);
            } 
        }
        getData();
        getImgs();
        getDivs();
        
    }, []);

    useEffect(() => {
        if(posts) {
            setLoading(false);
        }
    }, [posts]);

    const topics = ["Lifestyle", "Innovation", "Research", "Events", "Finance", "Technology & Gadgets", "Health"]

    function getItem(l: string, img: boolean) {
        if(img) {
          for(let i = 0; i < images.length; i++) {
            if(images[i].label===l) {
              return images[i]
            }
          }
        }
        else {
          for(let i = 0; i < divs.length; i++) {
            if(divs[i].label===l) {
              return divs[i]
            }
          }
        }
      }

    return (
        <>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : posts && posts.length > 0 ?
                    (
                        <div className="bg-white py-24 sm:py-32">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto max-w-2xl lg:max-w-4xl">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
                                    <p className="mt-2 text-lg leading-8 text-gray-600">
                                        {getItem('intro', false)?.content}
                                    </p>
                                    <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                                        {posts.map((post, index) => {
                                            const date = new Date(post.created_at);
                                            const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
                                            const userDataObject = users[index];
                                            const userData = userDataObject && userDataObject.user && userDataObject.user[0];
                                            const navigateToPost = () => {
                                                router.push(`/blog/${post.post_id}`);
                                            };

                                            return (
                                                <article key={post.post_id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                                                    <div
                                                        className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                                                        <Image
                                                            src='https://www.dropbox.com/scl/fi/z8vgvct0qo2tfs1r9i7eg/brownie-recipe.jpg?rlkey=f9vkc9dijqtvembbk5uzkwalk&raw=1'
                                                            alt=""
                                                            className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                                                            width={500} height={500}
                                                        />
                                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-x-4 text-xs">
                                                            <time dateTime={date.toISOString()} className="text-gray-500">
                                                                {formattedDate}
                                                            </time>
                                                            <a
                                                                href={post.topics}
                                                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                                            >
                                                                {post.topics}
                                                            </a>
                                                        </div>
                                                        <div className="group relative max-w-xl">
                                                            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                                                <a onClick={navigateToPost}>
                                                                    <span className="absolute inset-0"/>
                                                                    {post.title}
                                                                </a>
                                                            </h3>
                                                            <p className="mt-5 text-sm leading-6 text-gray-600">
                                                                {post.content.length > 150
                                                                    ? <div
                                                                        dangerouslySetInnerHTML={{__html: post.content.substring(0, 150) + "..."}}></div>
                                                                    : <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                                                            <div className="relative flex items-center gap-x-4">
                                                                <Image src={post.image_src} alt=""
                                                                     className="h-10 w-10 rounded-full bg-gray-50"
                                                                     width={100}
                                                                     height={100}/>
                                                                <div className="text-sm leading-6">
                                                                    <p className="font-semibold text-gray-900">
                                                                        <a href={post.user_id}>
                                                                            <span className="absolute inset-0"/>
                                                                            {userData ? userData.name : 'Loading...'}
                                                                        </a>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <p>No posts available.</p>
                    )
                }
            </div>
        </>
    )
        ;
}