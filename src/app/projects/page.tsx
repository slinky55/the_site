import Untitled from '@/app/images/Untitled.jpg'
import StaticImageData from 'next/image'

// SHOULD BE REPLACED BY EITHER WEB DATA OR DB DATA
const projects = [
    {
        id: 1,
        title: 'Solving world hunger',
        href: '#',
        description:
            'We are working on a project to solve world hunger. We are working with partners to provide food to those in need.',
        image:
            Untitled,
        author: {
            name: 'Dr. Thomas',
            image: Untitled,
        },
    },
    {
        id: 2,
        title: 'Solving world hunger',
        href: '#',
        description:
            'We are working on a project to solve world hunger. We are working with partners to provide food to those in need.',
        image:
        Untitled,
        author: {
            name: 'Dr. Thomas',
            image: Untitled,
        },
    },
    {
        id: 3,
        title: 'Solving world hunger',
        href: '#',
        description:
            'We are working on a project to solve world hunger. We are working with partners to provide food to those in need.',
        image:
        Untitled,
        author: {
            name: 'Dr. Thomas',
            image: Untitled,
        },
    },
    {
        id: 4,
        title: 'Solving world hunger',
        href: '#',
        description:
            'We are working on a project to solve world hunger. We are working with partners to provide food to those in need.',
        image:
        Untitled,
        author: {
            name: 'Dr. Thomas',
            image: Untitled,
        },
    },
]

export default function Projects() {
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
                        <article key={project.id} className="flex flex-col items-start justify-between">
                            <div className="relative w-full">
                                <StaticImageData src={project.image} alt="" className="object-cover w-full h-48 rounded-2xl" />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                            </div>
                            <div className="max-w-xl">
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href={project.href}>
                                            <span className="absolute inset-0" />
                                            {project.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{project.description}</p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <StaticImageData src={project.author.image} alt="" className="h-10 w-10 rounded-full bg-gray-100" />
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                                {project.author.name}
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