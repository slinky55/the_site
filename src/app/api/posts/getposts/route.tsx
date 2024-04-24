import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const limit = formData.limit;
    const offset = formData.offset;
    const sort = formData.sort;
    const filters = formData.filters;

    var query = "SELECT * FROM posts";

    if(filters.length > 0) {
        for(let i = 0; i < filters.length; i++) {
            if (i === 0) query = query.concat(" WHERE ")
            else query = query.concat(' AND ')
            
            if(filters[i].operator === 'IN') {
                const topicsArray = filters[i].fieldValue.split(',');
                for(let j = 0; j < topicsArray.length; j++) {
                    query = query.concat(`\'${topicsArray[j]}\' = ANY(topics) `);
                    if(((j+1) !== topicsArray.length)) {
                        query = query.concat('OR ')
                    }
                }
            }
            else if(filters[i].operator === 'CONTAINS') {
                query = query.concat(` ${filters[i].fieldName} LIKE \'%${filters[i].fieldValue}%\'`)
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
            return NextResponse.json({posts: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}