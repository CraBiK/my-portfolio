"use client";

import { useActionState } from "react";
import { signIn, SignInResult } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  // хук принимает (экшн, начальное состояние)
  const [state, formAction, isPending] = useActionState<SignInResult | null, FormData>(
    signIn, 
    null
  );

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Пароль" required />
          
          {state?.ok === false && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Вход..." : "Войти"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
