"use server";

import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { login as setSession } from "@/lib/auth";
import { logout as clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SignInResult = { ok: true } | { ok: false; error: string };

type UserRow = {
  id: number;
  email: string;
  password: string;
  role: string;
};

export async function signIn(
  _prevState: SignInResult | null,
  formData: FormData
): Promise<SignInResult> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { ok: false, error: "Укажите email и пароль." };
  }

  const [user] = await sql<UserRow[]>`
    SELECT * FROM users WHERE email = ${email}
  `;

  if (!user) {
    return { ok: false, error: "Неверный email или пароль." };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { ok: false, error: "Неверный email или пароль." };
  }

  await setSession({
    userId: String(user.id),
    email: user.email,
    role: user.role ?? "user",
  });
if (user.role === 'admin') {
    redirect("/admin");
  } 
	redirect("/"); 
  return { ok: true };
}

export async function signOutAction() {
  await clearSession(); // Твоя функция из lib/auth.ts, которая удаляет куку
  redirect("/login");
}
