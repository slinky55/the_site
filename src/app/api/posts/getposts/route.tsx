import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function GET(req: NextRequest, res: NextResponse) {
    
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM posts',
            values: '',
        })
        console.log(result);

        if (res) {
            return NextResponse.json({posts: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}