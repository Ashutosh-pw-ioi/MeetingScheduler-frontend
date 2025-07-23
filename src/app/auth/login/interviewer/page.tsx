import LoginPage from "../../loginPage";

export const metadata = {
  title: "Interviewer Login",
};

export default function AdminLoginPage() {
  return <LoginPage role="interviewer" imagePath="/Interviewer.png" />;
}
