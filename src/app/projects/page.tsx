'use client'

import { useEffect, useState } from "react";

interface Project {
    project_id: number;
    title: string;
    project_lead: string;
    primary_image_source: string;
    gallery: string;
    content: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/api/projects/getprojects");

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                if (!Array.isArray(data.projects)) {
                    throw new Error('Unexpected data format');
                }

                setProjects(data.projects);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, []);

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Projects</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        Welcome to the projects page. Here you can find all the projects we are currently working on.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {projects.map((project) => (
                        <article key={project.title} className="flex flex-col items-start justify-between">
                            <div className="relative w-full">
                                <img src={project.primary_image_source} alt="" className="object-cover w-full h-48 rounded-2xl" />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                            </div>
                            <div className="max-w-xl">
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href={project.gallery}>
                                            <span className="absolute inset-0" />
                                            {project.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{project.content}</p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <img src={project.project_lead} alt="" className="h-10 w-10 rounded-full bg-gray-100" />
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                                {project.project_lead}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}