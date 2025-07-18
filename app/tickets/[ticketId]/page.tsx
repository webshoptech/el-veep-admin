"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  TrashIcon,
  StarIcon,
  ArrowUturnLeftIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { getTicketDetail, replyTicket } from "@/app/api";
import { formatHumanReadableDate } from "@/utils/formatHumanReadableDate";
import Image from "next/image";
import GlobalSkeleton from "@/app/components/Skeletons/GlobalSkeleton";
import TicketType from "@/types/TicketType";
import MessageEntry from "@/types/MessageEntry";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.ticketId as string;
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const data = await getTicketDetail(ticketId);
      setTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket detail:", error);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);
  
  useEffect(() => {
    if (ticketId) {
      fetchDetail();
    }
  }, [ticketId, fetchDetail]);
  

  const parsedMessages = useMemo(() => {
    if (!ticket?.description) return [];

    try {
      const parsed = JSON.parse(ticket.description);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (err) {
      console.error("Failed to parse ticket.description", err);
      return [];
    }
  }, [ticket]);

  if (loading) {
    return <GlobalSkeleton />;
  }

  if (!ticket) {
    return (
      <div className="text-center p-10 text-red-500">Ticket not found.</div>
    );
  }

  return (
    <div className="p-6 bg-white h-screen rounded-xl w-full shadow">
      <div className="flex items-center justify-between mb-6">
        <button
          className="text-gray-600 hover:text-black"
          onClick={() => history.back()}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex gap-4 text-gray-500">
          <TrashIcon className="h-5 w-5 cursor-pointer hover:text-red-500" />
          <StarIcon className="h-5 w-5 cursor-pointer hover:text-yellow-400" />
          <ArrowUturnLeftIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 flex items-center">
          <Image
            src={ticket.reporter?.profile_photo || "/default.jpg"}
            alt="Avatar"
            width={25}
            height={25}
            className="rounded-full mr-1"
          />
          {ticket.reporter?.name} &lt;{ticket.reporter?.email}&gt;
        </p>
        <h2 className="text-lg font-semibold text-black ml-8">
          {ticket.title}
        </h2>
        <span className="text-xs text-gray-400 ml-8">
          {formatHumanReadableDate(ticket.created_at)}
        </span>
      </div>

      <div className="border-b mb-4" />

      <div className="text-gray-700 mb-8 leading-relaxed space-y-6 overflow-y-auto h-140">
        {parsedMessages.map((entry: MessageEntry, index: number) => {
          const isAgent = entry.sender === "agent";
          const sender = isAgent ? ticket.agent : ticket.reporter;

          return (
            <div
              key={`${entry.timestamp}-${index}`}
              className={`flex items-start gap-3 max-w-[80%] ${
                isAgent ? "ml-auto flex-row-reverse text-right" : "mr-auto"
              }`}
            >
              <Image
                src={sender?.profile_photo || "/default.jpg"}
                alt={sender?.name || "User"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div
                className={`p-4 rounded-xl text-sm ${
                  isAgent
                    ? "bg-gray-100 border border-orange-300"
                    : "bg-orange-50 border border-orange-200"
                }`}
              >
                <div className="font-semibold mb-1">{sender?.name}</div>
                <div
                  dangerouslySetInnerHTML={{ __html: entry.message }}
                  className="whitespace-pre-line"
                />
                <div className="text-xs text-gray-500 mt-2">
                  {formatHumanReadableDate(entry.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <TicketReply ticketId={ticket.ticket_id} onMessageSent={fetchDetail} />
    </div>
  );
}

function TicketReply({
  ticketId,
  onMessageSent,
}: {
  ticketId: string;
  onMessageSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);

    const newMessage = {
      0: {
        sender: "agent",
        message: message.trim(),
        timestamp: new Date().toISOString(),
      },
    };

    const formData = new FormData();
    formData.append("ticket_id", ticketId);
    formData.append("agent_id", "4"); // Optional: Replace with actual agent_id from context/store
    formData.append("description", JSON.stringify(newMessage));

    try {
      const res = await replyTicket(formData);
      if (res.status !== 'success') throw new Error("Failed to send message");
      setMessage("");
      onMessageSent(); // Refresh ticket after reply
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
          className="flex-1 border border-gray-300 text-gray-800 rounded-full px-4 py-5 text-sm focus:outline-none"
        />
        <PaperClipIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
