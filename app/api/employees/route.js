import pool from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
    return Response.json(rows);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { employee_name, email, phone_number, department, job_position, joining_date } = body;

    if (!employee_name ||!email ||!phone_number ||!department ||!job_position ||!joining_date) {
      return Response.json({ error: 'All fields required' }, { status: 400 });
    }

    const [existing] = await pool.query('SELECT id FROM employees WHERE email =?', [email]);
    if (existing.length > 0) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    const [result] = await pool.query(
      'INSERT INTO employees (employee_name, email, phone_number, department, job_position, joining_date) VALUES (?,?,?,?,?,?)',
      [employee_name, email, phone_number, department, job_position, joining_date]
    );
    return Response.json({ id: result.insertId,...body }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}