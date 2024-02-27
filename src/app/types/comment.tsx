export type Comment = {
    comment_id: string,
    user_id: string,
    post_id: string,
    parent_comment_id: string,
    content: string,
    created_at: Date,
    last_modified: Date
}