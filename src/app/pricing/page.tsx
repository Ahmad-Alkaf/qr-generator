import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Support QRForge",
  description: "Support the QRForge project.",
  alternates: { canonical: "/support" },
};

export default function PricingPage() {
  redirect("/support");
}
