import type { Metadata } from "next";
import IntervieweesSection from "./IntervieweesSection";

export const metadata: Metadata = {
  title: "Interviewees Details",
};

export default function Page() {
  return <IntervieweesSection />;
}
