import Resource from "../models/Resource.js";

// GET /api/resources  ?type=PDF&subject=DSA
export const getAllResources = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.subject) filter.subject = new RegExp(req.query.subject, "i");
    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

// GET /api/resources/:id
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).lean();
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

// POST /api/resources  (auth required) — JSON body, no file
export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({ ...req.body, uploaderRef: req.user.id });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

// POST /api/resources/upload  (auth required) — multipart/form-data with file
export const uploadResource = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { title, type, subject, tags } = req.body;

    if (!title || !type || !subject) {
      return res.status(400).json({ message: "title, type, and subject are required." });
    }

    // Build public URL for the file
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Calculate readable file size
    const bytes = req.file.size;
    const size =
      bytes < 1024
        ? `${bytes} B`
        : bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    const uploader = req.user?.name ?? "Unknown";
    const initials = uploader
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const resource = await Resource.create({
      title: title.trim(),
      type,
      subject: subject.trim(),
      uploader,
      uploaderInitials: initials,
      uploaderColor: req.user?.color ?? "#2F80ED",
      uploaderRef: req.user.id,
      fileUrl,
      fileType: req.file.mimetype,
      size,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });

    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

// PUT /api/resources/:id/like  (auth required) — toggle like
export const likeResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const userId = req.user.id;
    const alreadyLiked = resource.likedBy.includes(userId);
    if (alreadyLiked) {
      resource.likedBy.pull(userId);
      resource.likes = Math.max(0, resource.likes - 1);
    } else {
      resource.likedBy.push(userId);
      resource.likes += 1;
    }
    await resource.save();
    res.json({ likes: resource.likes, liked: !alreadyLiked });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/resources/:id  (auth required)
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted" });
  } catch (err) {
    next(err);
  }
};
