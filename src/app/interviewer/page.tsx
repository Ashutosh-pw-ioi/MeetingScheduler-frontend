import type { Metadata } from "next";
import InterviewerInterface from "./InterviewerInterface";

export const metadata: Metadata = {
  title: "Add Slots",
  description: "Interviewers can add their available slots",
};

export default function Page() {
  return <InterviewerInterface />;
}
