import type { Metadata } from "next";
import InterviewerInterface from "./AdminInterface";

export const metadata: Metadata = {
  title: "Overview",
  description: "Interviewers and Interviewees Data Overview",
};

export default function Page() {
  return <InterviewerInterface />;
}
