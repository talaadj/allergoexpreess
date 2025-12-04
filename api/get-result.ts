import { sql } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const birthDate = searchParams.get('birthDate');
    const phone = searchParams.get('phone');

    if (!orderId && !phone) {
        return new Response(JSON.stringify({ error: 'Missing search parameters' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        let result;
        if (orderId) {
            // Two-factor auth: orderId + birthDate (if provided)
            if (birthDate) {
                result = await sql`SELECT * FROM results WHERE order_id ILIKE ${orderId.trim()} AND birth_date = ${birthDate} LIMIT 1`;
            } else {
                // Fallback to orderId only for backward compatibility
                result = await sql`SELECT * FROM results WHERE order_id ILIKE ${orderId.trim()} LIMIT 1`;
            }
        } else if (phone) {
            const cleanPhone = phone.replace(/[^\d+]/g, '');
            result = await sql`SELECT * FROM results WHERE phone = ${cleanPhone} LIMIT 1`;
        }

        if (result && result.rows.length > 0) {
            return new Response(JSON.stringify(result.rows[0]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
