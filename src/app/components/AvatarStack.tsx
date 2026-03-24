import { motion } from "motion/react";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface AvatarStackProps {
  users: User[];
  max?: number;
}

export function AvatarStack({ users, max = 5 }: AvatarStackProps) {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative"
        >
          <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#0047BA] to-[#EC008C] flex items-center justify-center text-white shadow-md">
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </div>
        </motion.div>
      ))}
      {remaining > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600 shadow-md"
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  );
}
