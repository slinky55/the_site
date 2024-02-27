import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function GET(req: NextRequest, res: NextResponse) {
    
    try  {
        const result = await executeQuery({
            query: 'SELECT * FROM Project',
            values: '',
        })
        console.log(result);

        if (res) {
            return NextResponse.json({projects: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}