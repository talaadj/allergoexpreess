import { sql } from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Get the request body text first
        const bodyText = await request.text();

        // Check if body is empty
        if (!bodyText || bodyText.trim() === '') {
            return new Response(JSON.stringify({ error: 'Request body is empty' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Parse JSON
        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (parseError: any) {
            return new Response(JSON.stringify({
                error: 'Invalid JSON format',
                details: parseError.message
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { orderId, patientName, phone, date, birthDate, medications, iin, gender, address, customer, sampleDate, registrationDate } = data;

        if (!orderId || !patientName) {
            return new Response(JSON.stringify({ error: 'Missing required fields: orderId and patientName are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return new Response(JSON.stringify({ error: 'At least one medication is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create table if not exists
        await sql`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        date VARCHAR(255),
        medications JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

        // Add new columns if they don't exist (safe migration)
        try {
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS birth_date VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS iin VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS gender VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS address VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS customer VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS sample_date VARCHAR(255);`;
            await sql`ALTER TABLE results ADD COLUMN IF NOT EXISTS registration_date VARCHAR(255);`;
        } catch (e) {
            // Columns might already exist, ignore error
            console.log('Error adding columns:', e);
        }

        // Insert data
        await sql`
      INSERT INTO results (order_id, patient_name, phone, date, birth_date, iin, gender, address, customer, sample_date, registration_date, medications)
      VALUES (
        ${orderId}, 
        ${patientName}, 
        ${phone || null}, 
        ${date}, 
        ${birthDate || null}, 
        ${iin || null}, 
        ${gender || null}, 
        ${address || null}, 
        ${customer || null}, 
        ${sampleDate || null}, 
        ${registrationDate || null}, 
        ${JSON.stringify(medications)}
      )
      ON CONFLICT (order_id) DO UPDATE SET
        patient_name = EXCLUDED.patient_name,
        phone = EXCLUDED.phone,
        date = EXCLUDED.date,
        birth_date = EXCLUDED.birth_date,
        iin = EXCLUDED.iin,
        gender = EXCLUDED.gender,
        address = EXCLUDED.address,
        customer = EXCLUDED.customer,
        sample_date = EXCLUDED.sample_date,
        registration_date = EXCLUDED.registration_date,
        medications = EXCLUDED.medications;
    `;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error in add-result:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
