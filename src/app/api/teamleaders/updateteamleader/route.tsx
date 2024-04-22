import { NextRequest, NextResponse } from "next/server";
import executeQuery from "../../../lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("hey");
    const formData = await new Response(req.body).json();
    const leaderId = formData.leader_id;
    const name = formData.leader_name;
    const role = formData.team_role;
    const about = formData.about_me;
    const imageSrc = formData.image_src;

    
    try  {
        const result = await executeQuery({
            query: `UPDATE TeamLeader SET leader_name = ?, team_role = ?, about_me = ?, image_src = ? WHERE leader_id = ?`,
            values: [name, role, about, imageSrc, leaderId],
        })
        console.log(result);

        if (res) {
            return NextResponse.json({leaders: result}, {status: 200})
        } else {
            console.error('Response object is undefined.');
        }

    } catch ( error ) {
        console.log( error );
    }
}