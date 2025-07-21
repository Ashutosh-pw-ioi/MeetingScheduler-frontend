import type { Metadata } from "next";
import IntervieweeInterface from "./IntervieweeInterface";

export const metadata: Metadata = {
  title: "Book Slot",
  description: "Interviewees can book available slots",
};

export default function Page() {
  return <IntervieweeInterface />;
}
