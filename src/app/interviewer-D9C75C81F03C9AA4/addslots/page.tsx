import type { Metadata } from "next";
import AddSlotsSection from "./AddSlotsSection";

export const metadata: Metadata = {
  title: "Add Slots",
  description: "Interviewers can add their available slots",
};

export default function Page() {
  return <AddSlotsSection />;
}
