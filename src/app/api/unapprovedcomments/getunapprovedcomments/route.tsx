import { NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM unapproved_comments',
            values: '',
        })
        console.log(result);

        if (res) {
            return NextResponse.json({comments: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}