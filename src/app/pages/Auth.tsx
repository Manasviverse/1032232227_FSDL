import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GradientButton } from "../components/GradientButton";
import { FloatingShapes } from "../components/FloatingShapes";
import { Sparkles, User, Mail, Lock, Users, Crown, GraduationCap } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface AuthProps {
  onAuth: (user: any) => void;
}

export function Auth({ onAuth }: AuthProps) {
  const [mode, setMode] = useState<"login" | "signup" | "role" | "avatar">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    avatar: ""
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const avatars = ["😊", "🎓", "🚀", "🌟", "🎨", "🎯", "🎪", "🎭", "🎸", "🎮", "🏀", "⚡"];
  
  const roles = [
    { id: "student", label: "Student", icon: GraduationCap, color: "from-[#0047BA] to-[#0056D6]" },
    { id: "tutor", label: "Tutor", icon: Users, color: "from-[#6FDA44] to-[#5BC936]" },
    { id: "admin", label: "Admin", icon: Crown, color: "from-[#EC008C] to-[#FF1A9E]" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      onAuth({ ...formData, role: "student", avatar: "😊" });
    } else if (mode === "signup") {
      setMode("role");
    } else if (mode === "role") {
      setMode("avatar");
    } else if (mode === "avatar") {
      setShowConfetti(true);
      setTimeout(() => {
        onAuth(formData);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <FloatingShapes />
      
      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#0047BA", "#6FDA44", "#EC008C", "#FFC72C"][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0047BA] to-[#EC008C] flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent">
            EduSync
          </span>
        </div>

        {/* Auth Card */}
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
          style={{
            boxShadow: "0 0 0 1px rgba(0, 71, 186, 0.1), 0 20px 60px rgba(0, 71, 186, 0.2)"
          }}
        >
          {/* Gradient glow border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0047BA] via-[#EC008C] to-[#6FDA44] opacity-20 blur-xl"></div>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* Login/Signup Form */}
              {(mode === "login" || mode === "signup") && (
                <motion.div
                  key="auth-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-3xl font-bold mb-2 text-center">
                    {mode === "login" ? "Welcome Back!" : "Join EduSync"}
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    {mode === "login" ? "Let's get you studying" : "Create your account"}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Sarah Johnson"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-xl border-2 focus:border-[#0047BA] transition-all"
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-xl border-2 focus:border-[#0047BA] transition-all"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="rounded-xl border-2 focus:border-[#0047BA] transition-all"
                        required
                      />
                    </div>

                    <GradientButton variant="primary" size="lg" className="w-full mt-6">
                      {mode === "login" ? "Sign In" : "Continue"}
                    </GradientButton>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="text-[#0047BA] hover:underline"
                    >
                      {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Role Selection */}
              {mode === "role" && (
                <motion.div
                  key="role-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-3xl font-bold mb-2 text-center">Choose Your Role</h2>
                  <p className="text-gray-600 text-center mb-6">How will you use EduSync?</p>

                  <div className="space-y-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <motion.button
                          key={role.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setFormData({ ...formData, role: role.id });
                            handleSubmit(new Event("submit") as any);
                          }}
                          className={`w-full p-4 rounded-2xl bg-gradient-to-r ${role.color} text-white flex items-center gap-4 shadow-lg hover:shadow-xl transition-all`}
                        >
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">{role.label}</div>
                            <div className="text-sm opacity-90">
                              {role.id === "student" && "Learn and collaborate with peers"}
                              {role.id === "tutor" && "Guide and support learners"}
                              {role.id === "admin" && "Manage teams and permissions"}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Avatar Selection */}
              {mode === "avatar" && (
                <motion.div
                  key="avatar-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-3xl font-bold mb-2 text-center">Pick Your Avatar</h2>
                  <p className="text-gray-600 text-center mb-6">Choose one that vibes with you</p>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {avatars.map((avatar) => (
                      <motion.button
                        key={avatar}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, avatar })}
                        className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all ${
                          formData.avatar === avatar
                            ? "bg-gradient-to-br from-[#0047BA] to-[#EC008C] shadow-lg ring-4 ring-[#0047BA]/30"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {avatar}
                      </motion.button>
                    ))}
                  </div>

                  <GradientButton 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    Let's Go! 🚀
                  </GradientButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Friendly microcopy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          By continuing, you agree to make studying less boring
        </motion.p>
      </motion.div>
    </div>
  );
}
