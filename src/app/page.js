import { redirect } from "next/navigation";

export default function HomePage() {
  // Jaise hi koi tere main domain pe aayega, yeh usko seedha admin panel pe redirect kar dega.
  // Agar user logged in nahi hai, toh tera middleware usko apne aap /login pe bhej dega.
  redirect("/admin");
}