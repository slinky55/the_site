import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try  {
        const data = await req.json()
        console.log(data)
        const result = await executeQuery({
            query: `UPDATE users SET "privilegeLevel" = ? WHERE "users"."id" = ?`,
            values: [data.privilegeLevel, data.id],
        })

        if (res) {
            return NextResponse.json({user: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}