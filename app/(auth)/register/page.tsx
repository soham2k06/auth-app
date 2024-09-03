"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { decrypt, updateSessionCookie } from "@/lib/actions/auth";
import { registerSchema, RegisterSchema } from "@/lib/validation/auth";
import { registerAPI } from "@/services/api-auth";
import { IErrorRe`s } from "@/types";
import { IInviteLinkSession } from "@/types/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  // Get the invite link session from the URL
  const searchParams = useSearchParams();
  const inviteSession = searchParams.get("invite-session");

  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: register, isPending } = useMutation({
    mutationFn: registerAPI,
    onError: (err: IErrorRes) =>
      toast.error(err.response.data.message ?? "An error occurred"),
    onSuccess: (data) => {
      updateSessionCookie(data.session);
      router.push("/main");
    },
  });

  async function handleRegister(data: RegisterSchema) {
    const decryptedSession = inviteSession
      ? ((await decrypt(inviteSession)) as IInviteLinkSession)
      : null;

    // Pass the organization and role from the invite link session
    register({
      ...data,
      organization: decryptedSession?.organization,
      role: decryptedSession?.role,
    });
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <FormField
                name="firstname"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        disabled={isPending}
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastname"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full space-y-0">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        disabled={isPending}
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      disabled={isPending}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      disabled={isPending}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button loading={isPending} className="w-full">
              Register
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
