import { request } from "@/lib/api/http";

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const ContactApi = {
  send(payload: ContactPayload): Promise<{ detail: string }> {
    return request<{ detail: string }>("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
