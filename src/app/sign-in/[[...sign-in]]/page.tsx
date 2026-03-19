import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthPageLayout>
      <SignIn />
    </AuthPageLayout>
  );
}
