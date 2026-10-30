// =========================================
// MONGODB STORE
// Keeps the tasks in a MongoDB database (for example a free MongoDB
// Atlas cluster). Used when the MONGODB_URI environment variable is set.
// This is what lets the API work on hosts like Vercel, where files and
// memory are not kept between requests.
// =========================================

const { MongoClient } = require("mongodb");

const startingTasks = require("./data/tasks.json");

function clone(list) {
  return list.map(function (task) {
    return { ...task };
  });
}

// Never send MongoDB's internal _id to the frontend
const hideId = { projection: { _id: 0 } };

function withoutId(task) {
  if (!task) {
    return null;
  }
  const { _id, ...rest } = task;
  return rest;
}

// One connection is shared by every request.
// On the first use the database is filled with the starting tasks.
let collectionPromise = null;

function getCollection() {
  if (!collectionPromise) {
    collectionPromise = (async function () {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const collection = client.db(process.env.MONGODB_DB || "techbridge").collection("tasks");
      await collection.createIndex({ id: 1 }, { unique: true });

      if ((await collection.countDocuments()) === 0) {
        try {
          await collection.insertMany(clone(startingTasks));
        } catch (error) {
          // Another request filled it at the same moment: that is fine
          if (error.code !== 11000 && !(error.writeErrors && error.writeErrors.length)) {
            throw error;
          }
        }
      }
      return collection;
    })();

    // If connecting fails, allow the next request to try again
    collectionPromise.catch(function () {
      collectionPromise = null;
    });
  }
  return collectionPromise;
}

async function highest(collection, filter, field) {
  const top = await collection.find(filter, { projection: { [field]: 1 } })
    .sort({ [field]: -1 }).limit(1).toArray();
  return top.length ? top[0][field] : 0;
}

module.exports = {
  name: "mongodb",

  async list(track) {
    const collection = await getCollection();
    const filter = track ? { track: track } : {};
    return collection.find(filter, hideId).sort({ id: 1 }).toArray();
  },

  async get(id) {
    const collection = await getCollection();
    return collection.findOne({ id: id }, hideId);
  },

  async setStatus(id, status) {
    const collection = await getCollection();
    return collection.findOneAndUpdate(
      { id: id },
      { $set: { status: status } },
      { returnDocument: "after", projection: { _id: 0 } }
    );
  },

  async add(data) {
    const collection = await getCollection();
    const task = {
      id: Math.max(await highest(collection, {}, "id"), startingTasks.length) + 1,
      track: data.track,
      number: (await highest(collection, { track: data.track }, "number")) + 1,
      title: data.title,
      day: null,
      difficulty: "Custom",
      description: data.description,
      details: data.description,
      skills: [],
      status: "not-started",
      custom: true
    };
    await collection.insertOne({ ...task });
    return task;
  },

  async remove(id) {
    const collection = await getCollection();
    return collection.findOneAndDelete({ id: id }, hideId);
  },

  async reset(track) {
    const collection = await getCollection();
    const fresh = clone(startingTasks.filter(function (task) { return task.track === track; }));
    await collection.deleteMany({ track: track });
    await collection.insertMany(clone(fresh));
    return fresh.map(withoutId);
  }
};
