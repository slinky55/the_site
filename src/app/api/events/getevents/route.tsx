import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";


export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const limit = formData.limit;
    const offset = formData.offset;
    const sort = formData.sort;
    const filters = formData.filters;

    var query = "SELECT * FROM Event";

    if(filters.length > 0) {
            query = query.concat(" WHERE ")
            for(let i = 0; i < filters.length; i++) {
                if (i !== 0) query = query.concat(' AND ')
                    query = query.concat(`${filters[i].fieldName} `)
                if(filters[i].operator === 'IN') {
                    query = query.concat(`IN (${filters[i].fieldValue})`);
                }
                else if(filters[i].operator === 'CONTAINS') {
                    query = query.concat(`LIKE \'%${filters[i].fieldValue}%\'`)
                }
            }
    }
    query = query.concat(` ORDER BY ${sort.fieldName} ${sort.direction} LIMIT ? OFFSET ?`);

    try  {
        const result = await executeQuery({
            query: query,
            values: [limit, offset],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({events: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}