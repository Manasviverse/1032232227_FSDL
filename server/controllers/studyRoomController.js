import StudyRoom from "../models/StudyRoom.js";

// GET /api/study-rooms
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await StudyRoom.find().sort({ activeNow: -1, members: -1 }).lean();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// GET /api/study-rooms/:id
export const getRoomById = async (req, res, next) => {
  try {
    const room = await StudyRoom.findById(req.params.id).lean();
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

// POST /api/study-rooms  (auth required)
export const createRoom = async (req, res, next) => {
  try {
    const room = await StudyRoom.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

// PUT /api/study-rooms/:id  (auth required)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await StudyRoom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/study-rooms/:id  (auth required)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await StudyRoom.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (err) {
    next(err);
  }
};
