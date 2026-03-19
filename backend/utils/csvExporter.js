const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

class CSVExporter {
  constructor() {
    this.exportDir = path.join(__dirname, '../exports');
    
    // Create exports directory if it doesn't exist
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  async exportIssues(issues, filename = null) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = filename || `issues-export-${timestamp}.csv`;
    const filePath = path.join(this.exportDir, fileName);

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Title' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'status', title: 'Status' },
        { id: 'upvotes', title: 'Upvotes' },
        { id: 'commentsCount', title: 'Comments Count' },
        { id: 'reportedBy', title: 'Reported By' },
        { id: 'reportedEmail', title: 'Reporter Email' },
        { id: 'location', title: 'Location (lng,lat)' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
        { id: 'imageUrl', title: 'Image URL' },
        { id: 'resolvedImageUrl', title: 'Resolution Image URL' }
      ]
    });

    const records = issues.map(issue => ({
      id: issue._id.toString(),
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      upvotes: issue.upvotes,
      commentsCount: issue.comments ? issue.comments.length : 0,
      reportedBy: issue.user ? issue.user.name : 'Unknown',
      reportedEmail: issue.user ? issue.user.email : 'Unknown',
      location: issue.location && issue.location.coordinates ? 
                `${issue.location.coordinates[0]},${issue.location.coordinates[1]}` : 'No location',
      createdAt: new Date(issue.createdAt).toLocaleString(),
      updatedAt: new Date(issue.updatedAt).toLocaleString(),
      imageUrl: issue.image || '',
      resolvedImageUrl: issue.resolvedImage || ''
    }));

    await csvWriter.writeRecords(records);
    
    return {
      fileName,
      filePath,
      count: records.length
    };
  }

  // Clean up old exports (older than 1 hour)
  cleanupOldExports() {
    const files = fs.readdirSync(this.exportDir);
    const now = Date.now();
    
    files.forEach(file => {
      const filePath = path.join(this.exportDir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtimeMs;
      
      // Delete files older than 1 hour
      if (age > 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = new CSVExporter();