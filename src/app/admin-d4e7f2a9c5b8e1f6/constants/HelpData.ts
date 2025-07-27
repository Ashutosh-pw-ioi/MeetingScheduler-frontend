import { Mail, Phone } from "lucide-react";

export const helpItems = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call us during business hours (9 AM - 6 PM)",
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your queries via email",
    action: "Send Email",
  },
];

export const faqs = [
  {
    question: "What does the Overview section provide?",
    answer:
      "The Overview tab gives you high-level insights into the system. It includes charts and statistics about total interviewers and interviewees, booking status, and overall platform usage. It helps you monitor system-wide performance and identify bottlenecks or trends.",
  },
  {
    question: "What can I do in the Interviewers tab?",
    answer:
      "The Interviewers tab lists all registered interviewers along with their availability and booking status. You can view which slots are available, which have been booked, and detailed history of each interviewer's past interviews, including meet links and interviewee names.",
  },
  {
    question: "What is shown in the Interviewees tab?",
    answer:
      "The Interviewees tab displays all interviewees with their details—name, email, phone number, and current status (booked or not). You can also view which interviewer they were matched with, when the interview is scheduled, and access the meet links for each session.",
  },
  {
    question: "What resources are available in the Help section?",
    answer:
      "The Help section includes FAQs, admin user guides, troubleshooting tips, and documentation on managing interviewers and interviewees. It also provides contact options like phone and email support for quick assistance.",
  },
];
