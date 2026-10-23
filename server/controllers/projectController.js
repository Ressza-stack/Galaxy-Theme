const Project = require('../models/Project');
exports.getProjects = async (req, res, next) => {
  try { res.json({ success: true, data: await Project.find().sort({ order: 1, createdAt: -1 }) }); }
  catch (err) { next(err); }
};
exports.getProject = async (req, res, next) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};
exports.createProject = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await Project.create(req.body) }); }
  catch (err) { next(err); }
};
exports.updateProject = async (req, res, next) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};
exports.deleteProject = async (req, res, next) => {
  try {
    const p = await Project.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};
