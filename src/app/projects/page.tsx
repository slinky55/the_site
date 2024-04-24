import {Project} from "../types/project";
import executeQuery from "../lib/db";
import {Div} from "../types/div";
import Image from "next/image";

export default async function Projects() {
    const projects = await executeQuery({
        query: 'SELECT * FROM Project',
        values: '',
    }) as Project[];

    const res = await executeQuery({
        query: 'SELECT * FROM Images WHERE page=\'projects\'',
        values: '',
      }) as any[];

      const images = res.map((img: any) => {
        return { ...img }
      });

      const res2 = await executeQuery({
        query: 'SELECT * FROM Divs WHERE page=\'projects\'',
        values: '',
      }) as Div[];

      const divs = res2.map((div: Div) => {
        return { ...div }
      });

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
        <div className="bg-white py-4 sm:py-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Projects</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        {getItem('intro',false)?.content}
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {projects.map((project: Project) => (
                      <a className="flex flex-col items-start justify-between hover:cursor-pointer" href={`projects/${project.project_id}`}>
                        <article key={project.title}>
                            <div className="relative w-full">
                                <Image src={project.primary_image_src} alt="" className="object-cover w-full h-48 rounded-2xl" width={500} height={500} />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                            </div>
                            <div className="max-w-xl">
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                            <span className="absolute inset-0" />
                                            {project.title}
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{project.content}</p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                                {project.project_lead}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}