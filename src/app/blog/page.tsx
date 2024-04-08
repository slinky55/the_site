import View from "./view"
import { Post } from '../types/post';
import executeQuery from "../lib/db";

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