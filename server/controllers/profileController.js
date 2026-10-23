const Profile = require('../models/Profile');
async function getOrCreate() {
  let p = await Profile.findOne();
  if (!p) p = await Profile.create({});
  return p;
}
exports.getProfile = async (req, res, next) => {
  try { res.json({ success: true, data: await getOrCreate() }); }
  catch (err) { next(err); }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const p = await getOrCreate();
    Object.assign(p, req.body);
    await p.save();
    res.json({ success: true, data: p });
  } catch (err) { next(err); }
};
