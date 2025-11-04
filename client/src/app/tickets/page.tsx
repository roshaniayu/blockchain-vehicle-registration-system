"use client";

// Component
import { TicketListTable } from "@/app/tickets/components/ticketListTable";

export default function TicketsPage() {
  return (
    <div className="p-8 rounded-2xl h-full">
      <TicketListTable />
    </div>
  );
}
