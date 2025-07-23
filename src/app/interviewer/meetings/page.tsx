import type { Metadata } from "next";
import MeetingsSection from "./MeetingSection";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Have a view of all live, upcoming and past meetings",
};

export default function Page() {
  return <MeetingsSection />;
}
