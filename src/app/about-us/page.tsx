import { Header } from '@/app/components/Header'
import { Container } from '@/app/components/Container'

// PLACE HOLDER FOR TESTING
const people = [
    {
        name: 'Example Name 1',
        role: 'Example Role 1',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/c/ce/Mr_Krabs_character.png',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
    {
        name: 'Example Name 2 ',
        role: 'Example Role 2 ',
        imageUrl:
        'https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
    {
        name: 'Example Name 3',
        role: 'Example Role 3',
        imageUrl:
        'https://facts.net/wp-content/uploads/2023/09/24-facts-about-pearl-krabs-spongebob-squarepants-1693830382.jpg',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
    {
        name: 'Example Name 4 ',
        role: 'Example Role 4 ',
        imageUrl:
        'http://t2.gstatic.com/images?q=tbn:ANd9GcRthRYDL-KdDcjB_UFAKbf7VwB8oCbEqnfyki4wcMSabPJQV-UQzL7AWjn7uB8Pob-Qfp2d',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
    {
        name: 'Example Name 5 ',
        role: 'Example Role 5 ',
        imageUrl:
        'https://nickelodeonuniverse.com/wp-content/uploads/Mrs.Puff_.png',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
    {
        name: 'Example Name 6 ',
        role: 'Example Role 6 ',
        imageUrl:
        'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Patrick-Star.SpongeBob-SquarePants.webp',
        bio: 'Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio Example Bio.',
    },
]

export default function AboutUs() {
    return (
        <main>
            <Header/>
            <Container>
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Team</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We’re professors, researchers, and students enthusiastic about the use of technology and health.
                    </p>
                </div>
                <ul
                    role="list"
                    className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-8 xl:max-w-none"
                >
                    {people.map((person) => (
                        <li key={person.name} className="flex flex-col gap-6 xl:flex-row">
                            <img className="aspect-[4/5] w-52 flex-none rounded-2xl object-cover" src={person.imageUrl} alt="" />
                            <div className="flex-auto">
                                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
                                <p className="text-base leading-7 text-gray-600">{person.role}</p>
                                <p className="mt-6 text-base leading-7 text-gray-600">{person.bio}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Container>
            </main>
    )
}