import type { Metadata } from "next";
import InterviewerInterface from "./InterviewerInterface";

export const metadata: Metadata = {
  title: "Interviewer Overview",
  description: "Interviewer dashboard overview",
};

export default function Page() {
  return <InterviewerInterface />;
}
