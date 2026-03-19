const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create indexes
    await createIndexes(conn);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async (conn) => {
  try {
    const db = conn.connection.db;
    
    // Create text index for issues collection
    const collections = await db.listCollections({ name: 'issues' }).toArray();
    if (collections.length > 0) {
      await db.collection('issues').createIndex(
        { title: 'text', description: 'text' },
        { name: 'issue_text_search' }
      );
      
      // Create 2dsphere index for location
      await db.collection('issues').createIndex(
        { location: '2dsphere' },
        { name: 'location_geo_index' }
      );
      
      console.log('Database indexes created successfully');
    }
  } catch (error) {
    console.log('Index creation skipped:', error.message);
  }
};

module.exports = connectDB;