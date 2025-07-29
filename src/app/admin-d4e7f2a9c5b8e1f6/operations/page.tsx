import type { Metadata } from "next";
import OperationsSection from "./OperationsSection";

export const metadata: Metadata = {
  title: "Operations Details",
};

export default function Page() {
  return <OperationsSection />;
}
