// /app/lib/actions.js
"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Definisikan skema menggunakan Zod
const FormSchema = z.object({
  id: z.string().optional(), // ID optional karena akan di-generate oleh database
  customerId: z.string(),
  amount: z.coerce.number(), // Mengubah dari string ke number dan validasi
  status: z.enum(["pending", "paid"]),
  date: z.string().optional(), // Tanggal optional karena akan di-set saat create
});

// Omit id dan date dari skema karena akan diatur oleh database dan sistem
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData) {
  // Parse dan validasi data formulir menggunakan skema
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // Mengonversi jumlah menjadi sen
  const amountInCents = amount * 100;

  // Mendapatkan tanggal saat ini dalam format "YYYY-MM-DD"
  const date = new Date().toISOString().split("T")[0];

  // Masukkan data ke dalam database
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  // Revalidasi jalur untuk memperbarui data di cache dan navigasikan pengguna kembali
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
export async function updateInvoice(id, formData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
export async function deleteInvoice(id) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}