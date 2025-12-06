import Link from "next/link";
import {
  Plus,
  Clock,
  CheckCircle2,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/shared/components";

export default function ConsolePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Gradient Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            Welcome back! You have{" "}
            <span className="font-semibold text-[#3C48F6]">3 posts</span>{" "}
            scheduled for today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="hidden sm:flex rounded-full border-slate-300 text-slate-600 hover:text-[#3C48F6] hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <Zap className="mr-2 h-4 w-4 text-amber-500" /> AI Ideas
          </Button>

          {/* 2. Wired up the Button to the Create Page */}
          <Link href="/console/create">
            <Button className="rounded-full bg-gradient-to-r from-[#3C48F6] to-[#6366F1] shadow-lg shadow-[#3C48F6]/25 hover:shadow-[#3C48F6]/40 hover:scale-105 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<Clock className="h-6 w-6 text-[#3C48F6]" />}
          bg="bg-blue-50"
          title="Scheduled"
          value="12"
          trend="+4"
          trendUp={true}
          sub="Posts in queue"
        />
        <StatCard
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
          bg="bg-emerald-50"
          title="Published"
          value="84"
          trend="+12%"
          trendUp={true}
          sub="Last 30 days"
        />
        <StatCard
          icon={<Twitter className="h-6 w-6 text-sky-500" />}
          bg="bg-sky-50"
          title="Accounts"
          value="3"
          trend="0"
          trendUp={false}
          sub="Active platforms"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-400" />
              Upcoming Schedule
            </h2>
            <Button
              appearance="ghost"
              size="sm"
              className="text-slate-400 hover:text-[#3C48F6]"
            >
              View Calendar
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              <QueueItem
                platform="linkedin"
                time="Today, 2:00 PM"
                text="Launching our new feature!  The team has been working hard..."
                status="Ready"
              />
              <QueueItem
                platform="twitter"
                time="Tomorrow, 9:00 AM"
                text="5 tips for better productivity. Thread 👇"
                status="Draft"
              />
              <QueueItem
                platform="instagram"
                time="Wed, 4:30 PM"
                text="Behind the scenes at the office today. 📸"
                status="Ready"
              />
            </div>
            <div className="p-3 bg-slate-50 text-center">
              <button className="text-sm font-medium text-[#3C48F6] hover:underline">
                View all upcoming posts
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Performance</h2>
          <div className="bg-gradient-to-br from-[#3C48F6] to-[#6366F1] rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>

            <h3 className="relative z-10 text-blue-100 font-medium mb-1">
              Total Impressions
            </h3>
            <div className="relative z-10 text-4xl font-bold mb-4">12.4k</div>

            <div className="relative z-10 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <ArrowUpRight className="h-4 w-4 text-emerald-300" />
              <span>+24% vs last week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">
              Top Performing Platform
            </h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-sky-50 rounded-xl">
                <Twitter className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Twitter / X</div>
                <div className="text-xs text-slate-500">8.2k impressions</div>
              </div>
              <div className="ml-auto font-bold text-emerald-600 text-sm">
                +14%
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div
                className="bg-sky-500 h-2 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// (QueueItem and StatCard components remain the same as previous message)
function StatCard({ icon, title, value, sub, bg, trend, trendUp }: any) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-[#3C48F6]/30 transition-all duration-300 cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              trendUp
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

function QueueItem({ platform, time, text, status }: any) {
  const icons: any = {
    twitter: <Twitter className="h-4 w-4 text-white" />,
    linkedin: <Linkedin className="h-4 w-4 text-white" />,
    instagram: <Instagram className="h-4 w-4 text-white" />,
  };

  const bgColors: any = {
    twitter: "bg-sky-500",
    linkedin: "bg-[#0077b5]",
    instagram: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
  };

  const statusColors: any = {
    Ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-slate-50/80 transition-colors relative">
      <div
        className={`hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm ${bgColors[platform]}`}
      >
        {icons[platform]}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div
            className={`sm:hidden h-5 w-5 rounded-full flex items-center justify-center ${bgColors[platform]}`}
          >
            {icons[platform]}
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
              statusColors[status] || "bg-slate-100"
            }`}
          >
            {status}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {time}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-[#3C48F6] transition-colors">
          {text}
        </p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          appearance="ghost"
          size="sm"
          className="h-8 text-slate-400 hover:text-slate-700"
        >
          Edit
        </Button>
        <Button
          appearance="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-700"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
