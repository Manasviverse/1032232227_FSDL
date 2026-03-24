import { motion } from "motion/react";
import { GradientButton } from "../components/GradientButton";
import { FloatingCard } from "../components/FloatingCard";
import { FloatingShapes } from "../components/FloatingShapes";
import { 
  BookOpen, 
  Users, 
  Trophy, 
  FolderOpen, 
  BarChart3, 
  Wifi,
  Sparkles,
  Zap,
  Star
} from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  const features = [
    { icon: BookOpen, title: "Live Boards", description: "Collaborate in real-time with draggable cards", color: "blue" },
    { icon: Users, title: "Real-Time Sync", description: "See changes instantly across all devices", color: "green" },
    { icon: Trophy, title: "Quizzes & Leaderboards", description: "Gamified learning with instant feedback", color: "pink" },
    { icon: FolderOpen, title: "Resource Library", description: "Share and organize study materials", color: "yellow" },
    { icon: BarChart3, title: "Smart Analytics", description: "Track progress and performance", color: "purple" },
    { icon: Wifi, title: "Offline Mode", description: "Continue studying without internet", color: "blue" }
  ];

  const testimonials = [
    { name: "Sarah J.", quote: "EduSync made group projects actually fun!", avatar: "S", color: "from-[#0047BA] to-[#6FDA44]" },
    { name: "Mike R.", quote: "The quiz feature is addictive in the best way", avatar: "M", color: "from-[#EC008C] to-[#FFC72C]" },
    { name: "Priya K.", quote: "Finally, a study app that doesn't bore me to death", avatar: "P", color: "from-[#6FDA44] to-[#0047BA]" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingShapes />
      
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-20"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0047BA] to-[#EC008C] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0047BA] to-[#EC008C] bg-clip-text text-transparent">
              EduSync
            </span>
          </div>
          <GradientButton variant="primary" size="sm" onClick={onGetStarted}>
            Sign In
          </GradientButton>
        </motion.div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#0047BA] via-[#EC008C] to-[#6FDA44] bg-clip-text text-transparent">
                Study. Sync. Succeed.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The playful collaboration platform that makes studying with friends actually enjoyable. 
              Real-time boards, live quizzes, and gamified learning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center mb-16"
          >
            <GradientButton variant="primary" size="lg" onClick={onGetStarted}>
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Create Study Room
              </span>
            </GradientButton>
            <GradientButton variant="secondary" size="lg" onClick={onGetStarted}>
              Join with Code
            </GradientButton>
          </motion.div>

          {/* Animated Mock Board Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((col) => (
                  <div key={col}>
                    <div className="bg-gray-100 rounded-xl p-3 mb-3">
                      <div className="h-2 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    {[1, 2].map((card) => (
                      <motion.div
                        key={card}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, delay: (col + card) * 0.2, repeat: Infinity }}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 mb-3 shadow-md border border-gray-200"
                      >
                        <div className="h-2 bg-gradient-to-r from-[#0047BA] to-[#EC008C] rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything you need to study smarter</h2>
            <p className="text-gray-600 text-lg">Powerful features wrapped in a playful interface</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const gradients = {
                blue: "from-[#0047BA] to-[#0056D6]",
                green: "from-[#6FDA44] to-[#5BC936]",
                pink: "from-[#EC008C] to-[#FF1A9E]",
                yellow: "from-[#FFC72C] to-[#FFD154]",
                purple: "from-[#8B5CF6] to-[#A78BFA]"
              };
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingCard>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[feature.color as keyof typeof gradients]} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </FloatingCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Loved by students everywhere</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FloatingCard className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#FFC72C] text-[#FFC72C]" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 bg-gradient-to-br from-[#0047BA] to-[#EC008C]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your study sessions?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are making learning collaborative and fun
            </p>
            <GradientButton 
              variant="warm" 
              size="lg"
              onClick={onGetStarted}
              className="shadow-2xl"
            >
              Get Started Free
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
