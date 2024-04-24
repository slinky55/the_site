export type Post = {
    post_id: string,
    user_id: string,
    title: string,
    topics: string[],
    image_src: string,
    content: string,
    created_at: Date,
    last_modified: Date
  }