import pool from '@/lib/db';

export async function GET(req, { params }) {
  const { id } = await params;
  const [rows] = await pool.query('SELECT * FROM employees WHERE id =?', [id]);
  if (rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(rows[0]);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { employee_name, email, phone_number, department, job_position, joining_date } = body;
  await pool.query(
    'UPDATE employees SET employee_name=?, email=?, phone_number=?, department=?, job_position=?, joining_date=? WHERE id=?',
    [employee_name, email, phone_number, department, job_position, joining_date, id]
  );
  return Response.json({ message: 'Updated' });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await pool.query('DELETE FROM employees WHERE id=?', [id]);
  return Response.json({ message: 'Deleted' });
}