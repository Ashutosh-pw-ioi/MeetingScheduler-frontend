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
    question: "How do I add new interview slots?",
    answer:
      "Navigate to the 'Add Slots' tab and click on 'Add New Slot'. Select your preferred date, time, interview type, and location. You can add slots for up to 15 days in advance. The system will automatically update your availability calendar.",
  },
  {
    question: "Can I edit or delete existing slots?",
    answer:
      "Yes, you can modify your slots anytime. Go to the 'Add Slots' section, find the slot you want to change, and click the edit or delete icon. Note that you cannot modify slots that are already booked by candidates.",
  },
  {
    question: "How do I handle last-minute availability?",
    answer:
      "You can add new slots dynamically throughout the day. If you get unexpected free time, simply go to 'Add Slots' and create a new time slot. Candidates will be notified of new availability in real-time.",
  },
  {
    question: "Where can I see my scheduled interviews?",
    answer:
      "Check the 'Meetings' tab which shows three sections: Today's interviews, Upcoming interviews (next 14 days), and Past interviews. Each section provides detailed information about candidates, interview types, and meeting links.",
  },
  {
    question: "What if a candidate doesn't show up?",
    answer:
      "If a candidate misses their interview, you can mark it as 'No Show' in your meetings list. The slot will automatically become available again, and you can reschedule or offer it to other candidates.",
  },
  {
    question: "How do I conduct virtual interviews?",
    answer:
      "For virtual interviews, meeting links are automatically generated when you create a slot. Candidates receive the link via email. You can also manually add your preferred video conferencing link when setting up the slot.",
  },
  {
    question: "Can I see my interview statistics?",
    answer:
      "Yes! The Overview tab provides comprehensive analytics including total slots created, booking rates, completed interviews, candidate ratings, and monthly performance trends to help you track your interviewing activity.",
  },
  {
    question: "How do I reschedule an interview?",
    answer:
      "To reschedule, go to your Upcoming meetings, click on the interview you want to change, and select 'Reschedule'. Choose a new available slot, and the system will automatically notify the candidate about the change.",
  },
];
