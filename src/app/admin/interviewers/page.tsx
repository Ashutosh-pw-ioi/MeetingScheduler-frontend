import type { Metadata } from "next";
import InterviewersSection from "./InterviewersSection";

export const metadata: Metadata = {
  title: "Interviewers Details",
};

export default function Page() {
  return <InterviewersSection />;
}
