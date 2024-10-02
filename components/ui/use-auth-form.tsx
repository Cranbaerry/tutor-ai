"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useState, useCallback, useEffect } from "react";
import { signInWithPassword, signInWithOAuth, signUp } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/legacy/image";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  formMode: "SignUp" | "SignIn";
}

export function UserAuthForm({ className, formMode, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentFormMode, setCurrentFormMode] = useState(formMode);

  // Update form mode with animation
  useEffect(() => {
    if (formMode !== currentFormMode) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setCurrentFormMode(formMode);
        setIsLoading(false);
      }, 300); // Animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [formMode, currentFormMode]);

  const handleSignUp = useCallback(async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await signUp({ email, password });
    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Successfully signed up", { description: `Hello ${data?.user?.email ?? "Guest"}` });
    router.push("/kuisioner");
  }, [router]);

  const handleSignIn = useCallback(async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    toast.success("Successfully logged in", { description: `Hello ${data?.user?.email ?? "Guest"}` });
    router.push("/kuisioner");
  }, [router]);

  const handleOAuthLogin = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await signInWithOAuth();

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    if (!data?.url) {
      toast.error("Oops! Something went wrong, please try again later");
      setIsLoading(false);
      return;
    }

    toast.info("Redirecting", { description: "You are now being redirected.." });
    router.push(data.url);
  }, [router]);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2">
        <Image src="/beexpert-logo.svg" alt="BEEXPERT Logo" width={80} height={82.5} priority />
        <Image src="/beexpert-name.svg" alt="BEEXPERT" width={170} height={19} priority />
      </div>

      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {currentFormMode === "SignUp" ? "Buat akun baru" : "Login dengan email"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentFormMode === "SignUp" ? "Masukkan email untuk membuat akun" : "Masukkan kredential untuk melanjutkan"}
        </p>
      </div>

      <div
        className={cn(
          "grid gap-6 transition-opacity duration-300 ease-in-out",
          isLoading ? "opacity-50" : "opacity-100",
          className
        )}
        {...props}
      >
        <form onSubmit={currentFormMode === "SignUp" ? handleSignUp : handleSignIn}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
              <Input
                id="password"
                name="password"
                placeholder="Kata Sandi"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {currentFormMode === "SignUp" ? "Daftar" : "Masuk"}
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Atau masuk dengan</span>
          </div>
        </div>

        <Button variant="outline" type="button" disabled={isLoading} onClick={handleOAuthLogin}>
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-1 h-4 w-4" />}{" "}
          Google
        </Button>
      </div>
    </>
  );
}
