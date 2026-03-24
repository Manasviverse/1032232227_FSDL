import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GradientButton } from "../components/GradientButton";
import { AnimatedTag } from "../components/AnimatedTag";
import { AvatarStack } from "../components/AvatarStack";
import {
  ArrowLeft,
  Plus,
  Users,
  Share2,
  MoreVertical,
  MessageSquare,
  Activity,
  Eye,
  Clock
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

interface StudyBoardProps {
  onBack: () => void;
}

interface Card {
  id: string;
  title: string;
  description: string;
  tags: string[];
  assignee?: string;
  editing?: boolean;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

function SortableCard({ card, onEdit }: { card: Card; onEdit: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const tagColors = ["blue", "green", "pink", "yellow"] as const;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ rotate: isDragging ? 0 : 1, y: -4 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-200 cursor-move mb-3 relative group"
    >
      {card.editing && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#6FDA44] animate-pulse shadow-lg"
          title="Someone is editing"
        >
          <span className="absolute inset-0 rounded-full bg-[#6FDA44] animate-ping opacity-75"></span>
        </motion.div>
      )}

      <h4 className="font-semibold mb-2 text-gray-900">{card.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{card.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {card.tags.map((tag, index) => (
          <AnimatedTag key={index} color={tagColors[index % tagColors.length]}>
            {tag}
          </AnimatedTag>
        ))}
      </div>

      {card.assignee && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0047BA] to-[#EC008C] flex items-center justify-center text-white text-xs">
            {card.assignee}
          </div>
          <span>Assigned</span>
        </div>
      )}
    </motion.div>
  );
}

export function StudyBoard({ onBack }: StudyBoardProps) {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Study 📚",
      cards: [
        { id: "1", title: "Review Chapter 5", description: "Focus on quantum mechanics principles", tags: ["Physics", "High Priority"], assignee: "S" },
        { id: "2", title: "Practice Problems", description: "Complete problem set 1-15", tags: ["Math"], assignee: "M", editing: true },
      ]
    },
    {
      id: "progress",
      title: "In Progress 🔄",
      cards: [
        { id: "3", title: "Group Discussion", description: "Prepare talking points for tomorrow", tags: ["History", "Team"], assignee: "P" },
      ]
    },
    {
      id: "done",
      title: "Completed ✅",
      cards: [
        { id: "4", title: "Lab Report", description: "Submitted on time!", tags: ["Chemistry"], assignee: "S" },
      ]
    }
  ]);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { user: "Sarah", message: "Hey team! Ready to crush this study session?", time: "2:30 PM", avatar: "S" },
    { user: "Mike", message: "Let's do this! 💪", time: "2:31 PM", avatar: "M" },
  ]);

  const activeUsers = [
    { id: "1", name: "Sarah", avatar: "S" },
    { id: "2", name: "Mike", avatar: "M" },
    { id: "3", name: "Priya", avatar: "P" }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Find source and destination columns
    let sourceColumn: Column | undefined;
    let destColumn: Column | undefined;
    let cardToMove: Card | undefined;

    columns.forEach(col => {
      const card = col.cards.find(c => c.id === active.id);
      if (card) {
        sourceColumn = col;
        cardToMove = card;
      }
      if (col.id === over.id || col.cards.some(c => c.id === over.id)) {
        destColumn = col;
      }
    });

    if (sourceColumn && destColumn && cardToMove) {
      const newColumns = columns.map(col => {
        if (col.id === sourceColumn!.id) {
          return { ...col, cards: col.cards.filter(c => c.id !== cardToMove!.id) };
        }
        if (col.id === destColumn!.id) {
          return { ...col, cards: [...col.cards, cardToMove!] };
        }
        return col;
      });
      setColumns(newColumns);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold">CS 101 Study Group</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                Room Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">ABC-123</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AvatarStack users={activeUsers} />
          <GradientButton variant="secondary" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Invite
          </GradientButton>
          <GradientButton variant="primary" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </GradientButton>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-x-auto p-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-max">
              {columns.map((column) => (
                <div key={column.id} className="w-80">
                  <div className="bg-gray-100 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{column.title}</h3>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-lg">
                        {column.cards.length}
                      </span>
                    </div>
                  </div>

                  <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {column.cards.map((card) => (
                        <SortableCard key={card.id} card={card} onEdit={() => {}} />
                      ))}
                    </div>
                  </SortableContext>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#0047BA] hover:text-[#0047BA] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Card
                  </motion.button>
                </div>
              ))}
            </div>
          </DndContext>
        </div>

        {/* Right Panel - Chat & Activity */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: showChat ? 320 : 0, opacity: showChat ? 1 : 0 }}
          className="bg-white border-l border-gray-200 overflow-hidden"
        >
          {showChat && (
            <div className="w-80 h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Live Chat</h3>
                  <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">
                    ×
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0047BA] to-[#EC008C] flex items-center justify-center text-white text-sm flex-shrink-0">
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
                        <div className="font-semibold text-sm mb-1">{msg.user}</div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <Input placeholder="Type a message..." className="rounded-xl" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#0047BA] to-[#EC008C] rounded-full shadow-lg flex items-center justify-center text-white z-50"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6FDA44] rounded-full text-xs flex items-center justify-center">
            2
          </span>
        </motion.button>
      )}

      {/* Real-time sync indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 left-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-[#6FDA44] rounded-full"
        />
        <span className="text-sm text-gray-600">Synced</span>
      </motion.div>
    </div>
  );
}
