import AuthFormCard from "@/components/auth/AuthFormCard";

export default function MasukPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4 lg:p-6 bg-[#F3F8F1]">
      <AuthFormCard mode="login" />
    </div>
  );
}