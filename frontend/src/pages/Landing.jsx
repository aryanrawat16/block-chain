import { Link } from "react-router-dom";
import {
  Vote,
  ShieldCheck,
  Link2,
  AlertTriangle,
  UserPlus,
  BarChart3,
  LogIn,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-brand-600 rounded-2xl p-4 mb-5 shadow-sm">
            <Vote size={30} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
            Vote securely, verify openly
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Daily results are sealed into a hash-linked blockchain block that anyone
            can verify. Built as an educational BCA prototype — not a real election
            system.
          </p>
        </div>

        {/* Colorful feature card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <FeatureCard
            color="violet"
            icon={<ShieldCheck size={22} />}
            title="Verified & private"
            subtitle="One voter, one vote"
          />
          <FeatureCard
            color="aqua"
            icon={<Link2 size={22} />}
            title="Hash-linked blocks"
            subtitle="One block per day"
          />
          <FeatureCard
            color="magenta"
            icon={<AlertTriangle size={22} />}
            title="Tamper-evident"
            subtitle="Edits get detected"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link to="/register">
            <FeatureCard
              color="orange"
              icon={<UserPlus size={22} />}
              title="Register to vote"
              subtitle="Create your account"
              clickable
            />
          </Link>
          <Link to="/admin/blockchain">
            <FeatureCard
              color="green"
              icon={<BarChart3 size={22} />}
              title="Live results"
              subtitle="See the blockchain explorer"
              clickable
            />
          </Link>
        </div>

        {/* Primary CTA */}
        <Link
          to="/register"
          className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white py-3.5 rounded-xl font-medium hover:bg-brand-700 transition shadow-sm mb-4"
        >
          <UserPlus size={18} /> Get Started
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-medium hover:border-brand-300 hover:text-brand-600 transition"
        >
          <LogIn size={18} /> I already have an account
        </Link>

        <p className="text-sm text-gray-400 mt-8 text-center">
          Election official?{" "}
          <Link to="/admin/login" className="text-brand-600 font-medium hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}

const colorMap = {
  violet: { bg: "bg-tint-violet-bg", text: "text-tint-violet-text", icon: "text-tint-violet-icon" },
  aqua: { bg: "bg-tint-aqua-bg", text: "text-tint-aqua-text", icon: "text-tint-aqua-icon" },
  magenta: { bg: "bg-tint-magenta-bg", text: "text-tint-magenta-text", icon: "text-tint-magenta-icon" },
  orange: { bg: "bg-tint-orange-bg", text: "text-tint-orange-text", icon: "text-tint-orange-icon" },
  green: { bg: "bg-tint-green-bg", text: "text-tint-green-text", icon: "text-tint-green-icon" },
};

function FeatureCard({ color, icon, title, subtitle, clickable }) {
  const c = colorMap[color];
  return (
    <div
      className={`${c.bg} rounded-2xl p-5 h-full ${
        clickable ? "hover:scale-[1.02] active:scale-100 transition-transform cursor-pointer" : ""
      }`}
    >
      <div className={c.icon}>{icon}</div>
      <div className={`${c.text} font-semibold text-sm mt-3`}>{title}</div>
      <div className={`${c.icon} text-xs mt-1 opacity-80`}>{subtitle}</div>
    </div>
  );
}
