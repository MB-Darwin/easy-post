"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Edit2,
  FileText,
  Instagram,
  Trash2,
  Twitter,
  Youtube,
  LinkedinIcon,
} from "lucide-react";

// Added new platforms
export type ChannelType =
  | "twitter"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "pinterest"
  | "google";

export type Channel = {
  id: string;
  type: ChannelType;
  name: string;
  avatar: string;
};

export type PostStatus = "queued" | "draft" | "published" | "failed" | "review";

export type Post = {
  id: number;
  content: string;
  channels: string[];
  status: PostStatus;
  scheduledTime: string;
  media?: string;
  mediaType?: "image" | "video";
};

// --- MOCK CHANNELS (Expanded) ---
export const CHANNELS: Channel[] = [
  {
    id: "c1",
    type: "twitter",
    name: "@StartupHype",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "c2",
    type: "linkedin",
    name: "Founder Inc.",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "c3",
    type: "instagram",
    name: "Visuals_Co",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "c4",
    type: "tiktok",
    name: "DailyTok",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: "c5",
    type: "facebook",
    name: "Brand Page",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: "c6",
    type: "youtube",
    name: "Tech Shorts",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: "c7",
    type: "pinterest",
    name: "Inspo Board",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    content: "🚀 We just launched v2.0! #SaaS",
    channels: ["c1", "c2"],
    status: "queued",
    scheduledTime: "2023-10-25T14:00:00",
  },
  {
    id: 2,
    content: "Behind the scenes 🎥",
    channels: ["c3", "c4"],
    status: "draft",
    scheduledTime: "",
    media:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
    mediaType: "image",
  },
  {
    id: 3,
    content: "Failed to sync...",
    channels: ["c4"],
    status: "failed",
    scheduledTime: "2023-10-24T09:00:00",
  },
  {
    id: 4,
    content: "Q4 Strategy Review",
    channels: ["c2"],
    status: "review",
    scheduledTime: "2023-10-28T10:00:00",
  },
  {
    id: 5,
    content: "Published successfully!",
    channels: ["c1"],
    status: "published",
    scheduledTime: "2023-10-20T10:00:00",
  },
];

// Helper for Icons
export const getChannelIcon = (type: string) => {
  switch (type) {
    case "twitter":
      return Twitter;
    case "instagram":
      return Instagram;
    case "linkedin":
      return LinkedinIcon;
    // case "tiktok":
    //   return Tiktok;
    case "youtube":
      return Youtube;
    // case "facebook":
    //   return Facebook;
    default:
      return Twitter;
  }
};

interface PostFeedProps {
  posts: Post[];
  onDelete: (id: number, status: string) => void;
  onStatusChange: (id: number, newStatus: "queued" | "draft") => void;
}

export function PostFeed({ posts, onDelete, onStatusChange }: PostFeedProps) {
  const drafts = posts.filter((p) => p.status === "draft");
  const queued = posts.filter(
    (p) => p.status === "queued" || p.status === "published"
  );

  // --- DRAG LOGIC ---
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("postId", id.toString());
  };

  const handleDropToQueue = (e: React.DragEvent) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("postId"));
    const post = posts.find((p) => p.id === id);

    // Only allow dragging Draft -> Queue
    if (post && post.status === "draft") {
      onStatusChange(id, "queued");
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pb-20">
      {/* --- LEFT COLUMN: DRAFTS --- */}
      <div>
        <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText /> Drafts ({drafts.length})
        </h3>

        <div className="space-y-4 min-h-[200px]">
          <AnimatePresence>
            {drafts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => onDelete(post.id, "draft")}
                draggable={true}
                onDragStart={(e: any) => handleDragStart(e, post.id)}
              />
            ))}
            {drafts.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                No drafts saved.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- RIGHT COLUMN: QUEUE (DROP ZONE) --- */}
      <div
        onDrop={handleDropToQueue}
        onDragOver={handleDragOver}
        className="relative group"
      >
        <h3 className="font-bold text-[#3C48F6] text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock /> Queue / Scheduled ({queued.length})
        </h3>

        {/* Visual Drop Zone Hint */}
        <div className="absolute inset-0 -z-10 bg-blue-50 rounded-xl border-2 border-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>

        <div className="space-y-4 min-h-[200px] rounded-xl transition-colors">
          <AnimatePresence>
            {queued.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={() => onDelete(post.id, post.status)}
                isQueued
              />
            ))}
            {queued.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-xl text-blue-400 text-sm">
                Drag a draft here to schedule it!
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- SINGLE POST CARD COMPONENT ---
const PostCard = ({
  post,
  onDelete,
  isQueued,
  draggable,
  onDragStart,
}: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-default ${
        draggable
          ? "cursor-grab active:cursor-grabbing border-gray-200"
          : "border-blue-100"
      }`}
    >
      {/* Header: Channels & Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex -space-x-2">
          {post.channels.map((c: string) => {
            // Mock finding channel icon
            const ch = CHANNELS.find((x) => x.id === c);
            const Icon = ch ? getChannelIcon(ch.type) : CheckCircle;
            return (
              <div
                key={c}
                className="w-6 h-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-gray-500"
              >
                <Icon size={12} />
              </div>
            );
          })}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
            isQueued ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          {post.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex gap-3">
        {post.media && (
          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={post.media}
              className="w-full h-full object-cover"
              alt="Post media"
            />
          </div>
        )}
        <p className="text-sm text-gray-700 line-clamp-2 flex-1">
          {post.content}
        </p>
      </div>

      {/* Footer: Time & Actions */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          {isQueued ? <Clock /> : <Edit2 />}
          <span>
            {post.scheduledTime
              ? new Date(post.scheduledTime).toLocaleDateString()
              : "Unscheduled"}
          </span>
        </div>

        <button
          onClick={onDelete}
          className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"
          title="Delete Post"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
