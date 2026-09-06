import { ContactPage } from "@/features/contact/components/contact-page";
import { getContactMetadata } from "@/features/contact/metadata";

export const metadata = getContactMetadata();

export default function ContactPageRoute() {
  return <ContactPage />;
}
