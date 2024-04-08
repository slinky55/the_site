import View from "./view"
import { Post } from '../types/post';
import executeQuery from "../lib/db";

  // const [posts, setPosts] = useState<Post[] | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  // const [ssStart, setSsStart] = useState<number>(0);
  // const [ssEnd, setSsEnd] = useState<number>(3);
  // const [users, setUsers] = useState<any[]>([]);
  // const limit = 10;

export default async function BlogPage() {
  const res = await executeQuery({
    query: 'SELECT * FROM posts',
    values: '',
  }) as Post[];

  const posts = res.map((post: Post) => {
    return { ...post }
  });

  return <View posts={posts} />
}