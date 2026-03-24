import { useState } from "react";
import { motion } from "motion/react";
import { FloatingCard } from "../components/FloatingCard";
import { GradientButton } from "../components/GradientButton";
import { AnimatedTag } from "../components/AnimatedTag";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell
} from "lucide-react";

interface CalendarPageProps {
  onBack: () => void;
}

export function CalendarPage({ onBack }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 17)); // Feb 17, 2026

  const events = [
    {
      id: 1,
      title: "Physics Study Session",
      date: new Date(2026, 1, 17),
      time: "2:00 PM - 4:00 PM",
      location: "Library Room 204",
      attendees: 5,
      color: "from-[#0047BA] to-[#0056D6]",
      type: "study"
    },
    {
      id: 2,
      title: "CS 101 Quiz",
      date: new Date(2026, 1, 19),
      time: "10:00 AM - 11:00 AM",
      location: "Online",
      attendees: 45,
      color: "from-[#EC008C] to-[#FF1A9E]",
      type: "quiz",
      urgent: true
    },
    {
      id: 3,
      title: "Group Project Meeting",
      date: new Date(2026, 1, 20),
      time: "3:00 PM - 5:00 PM",
      location: "Student Center",
      attendees: 4,
      color: "from-[#6FDA44] to-[#5BC936]",
      type: "meeting"
    },
    {
      id: 4,
      title: "Chemistry Lab",
      date: new Date(2026, 1, 21),
      time: "1:00 PM - 3:00 PM",
      location: "Science Building",
      attendees: 12,
      color: "from-[#FFC72C] to-[#FFD154]",
      type: "lab"
    }
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getDayEvents = (day: number) => {
    return events.filter(event => event.date.getDate() === day && event.date.getMonth() === currentDate.getMonth());
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -4 }}
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-xl font-bold">Study Calendar</h1>
              <p className="text-sm text-gray-600">Plan your study sessions</p>
            </div>
          </div>

          <GradientButton variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </GradientButton>
        </div>
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <FloatingCard hoverable={false}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevMonth}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {[...Array(firstDayOfMonth)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getDayEvents(day);
                  const isToday = day === 17; // Feb 17, 2026
                  const hasDeadline = dayEvents.some(e => e.urgent);

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      className={`aspect-square p-2 rounded-xl cursor-pointer transition-all relative ${
                        isToday
                          ? "bg-gradient-to-br from-[#0047BA] to-[#EC008C] text-white"
                          : dayEvents.length > 0
                          ? "bg-blue-50 hover:bg-blue-100"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-semibold text-sm">{day}</div>
                      {dayEvents.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event, idx) => (
                            <div
                              key={idx}
                              className={`text-xs px-1 py-0.5 rounded ${
                                isToday ? "bg-white/20" : "bg-white"
                              } truncate`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-center opacity-75">+{dayEvents.length - 2}</div>
                          )}
                        </div>
                      )}
                      {hasDeadline && !isToday && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute top-1 right-1 w-2 h-2 bg-[#EC008C] rounded-full"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </FloatingCard>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FloatingCard className="relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${event.color}`} />
                    <div className="pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.urgent && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Bell className="w-4 h-4 text-[#EC008C]" />
                          </motion.div>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <AnimatedTag color={event.type === "quiz" ? "pink" : event.type === "study" ? "blue" : event.type === "meeting" ? "green" : "yellow"}>
                          {event.type}
                        </AnimatedTag>
                      </div>
                    </div>
                  </FloatingCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
