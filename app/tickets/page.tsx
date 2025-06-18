"use client";

import { useState, useEffect } from "react";
import {
  ChatBubbleLeftEllipsisIcon,
  InboxIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { getTickets } from "@/app/api";
import Ticket from "@/types/Ticket";
import Image from "next/image";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Link from "next/link";

const menu = [
  {
    name: "ongoing",
    label: "Ongoing tickets",
    icon: ChatBubbleLeftEllipsisIcon,
  },
  { name: "open", label: "Open tickets", icon: InboxIcon },
  { name: "close", label: "Closed tickets", icon: PaperAirplaneIcon },
];

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("open");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetchTickets(activeTab);
  }, [activeTab]);

  const fetchTickets = async (type: string) => {
    try {
      const response = await getTickets(type);
      // Laravel wraps data like: response.data.data
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setTickets([]);
    }
  };

  // Add this inside your component
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const title = ticket.title?.toLowerCase() || "";
    const reporter = ticket.reporter?.name?.toLowerCase() || "";
    return (
      title.includes(searchTerm.toLowerCase()) ||
      reporter.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 rounded-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Support Tickets
        </h2>
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center w-full p-3 rounded-lg cursor-pointer hover:bg-orange-100 transition ${
                  activeTab === item.name
                    ? "bg-orange-500 text-white"
                    : "text-gray-800"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Ticket List */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search tickets"
            className="border border-gray-300 text-gray-500 rounded px-3 py-2 w-full mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="border px-3 py-2 rounded bg-white text-gray-600">
            Filter
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTickets.length === 0 ? (
            <p className="text-gray-400 mt-4 text-center">No tickets found</p>
          ) : (
            filteredTickets.map((ticket) => (
              <li
                key={ticket.id}
                className="bg-white border-orange-100 border rounded shadow hover:bg-gray-100 cursor-pointer"
              >
                <Link
                  href={`/settings/tickets/${ticket.ticket_id}`}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={ticket.reporter?.profile_photo}
                      alt="Avatar"
                      width={25}
                      height={25}
                      className="rounded-full"
                    />
                    <span className="font-semibold text-xs text-gray-400">
                      {ticket.reporter?.name}
                    </span>
                    <span className="text-gray-600 truncate max-w-xs">
                      {ticket.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {formatHumanReadableDate(ticket.created_at)}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
