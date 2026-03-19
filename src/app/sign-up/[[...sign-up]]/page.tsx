import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthPageLayout>
      <SignUp />
    </AuthPageLayout>
  );
}
