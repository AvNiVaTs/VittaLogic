import Counter from '../models/counter.model.js';

export const getNextSequence = async (name) => {
  const updatedCounter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return updatedCounter.seq;
};
