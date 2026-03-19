# Civic Issue Reporting & Resolution Platform API

A production-ready RESTful API for civic issue reporting and resolution built with Node.js, Express, MongoDB, and Cloudinary.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Issue Management**: Create, read, update, and delete civic issues
- **Image Upload**: Cloudinary integration for issue and resolution images
- **Geolocation**: Track issue locations with geospatial queries
- **Advanced Filtering**: Search, filter, pagination, and nearby issue detection
- **Admin Dashboard**: Comprehensive admin controls with CSV export
- **Security**: Helmet, CORS, rate limiting, input sanitization, and more

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **File Storage**: Cloudinary with Multer
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator
- **Others**: geolib, csv-writer, compression

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civic-issue-backend