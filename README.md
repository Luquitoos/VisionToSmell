# Video-converte Documentation

**English Documentation** | [Documentação em Português](README.pt.md)

## Project Overview

Video-converte is a full-stack web application designed to convert video files to audio (MP3) format. The application consists of:

- **Backend**: A Node.js/Express REST API that handles file uploads, video-to-audio conversion, and stores conversion history
- **Frontend**: A React application with Tailwind CSS for styling that provides a user-friendly interface for uploading videos and downloading converted audio files

The application allows users to:
1. Upload video files (supported formats: MP4, AVI, MOV, MKV, FLV, WMV)
2. Convert videos to MP3 audio format
3. View conversion history
4. Download converted audio files

## System Requirements

- Node.js (v14 or higher recommended)
- MongoDB database (local or Atlas cloud instance)
- FFmpeg installed and properly configured in your system PATH

## Dependencies

### Backend Dependencies
- **express**: Web server framework
- **mongoose**: MongoDB object modeling
- **fluent-ffmpeg**: Node.js wrapper for FFmpeg
- **multer**: Middleware for handling file uploads
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express-validator**: Input validation
- **morgan**: HTTP request logger
- **uuid**: Unique ID generation

### Frontend Dependencies
- **react**: UI library
- **axios**: HTTP client
- **react-icons**: Icon library
- **react-toastify**: Toast notifications
- **tailwindcss**: Utility-first CSS framework

### Root Project Development Dependencies
- **concurrently**: Allows running multiple commands simultaneously (used to start backend and frontend together)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Luquitoos/VisionToSmell.git
cd Video-converte
```

### 2. Installing FFmpeg

FFmpeg is a critical dependency for this project as it handles the actual video-to-audio conversion.

#### Windows
1. Download FFmpeg from the [official website](https://ffmpeg.org/download.html) or use the [gyan.dev build](https://www.gyan.dev/ffmpeg/builds/)
2. Extract the downloaded zip file to a location like `C:\ffmpeg`
3. Add FFmpeg to your system PATH:
   - Right-click on "This PC" or "Computer" and select "Properties"
   - Click on "Advanced system settings"
   - Click on "Environment Variables"
   - Under "System Variables", find the "Path" variable and click "Edit"
   - Click "New" and add the path to the FFmpeg bin directory (e.g., `C:\ffmpeg\bin`)
   - Click "OK" on all dialogs to save changes
4. Verify installation by opening Command Prompt and typing:
   ```
   ffmpeg -version
   ```

#### macOS (using Homebrew)
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

### 3. Set Up MongoDB

1. Install MongoDB locally or create a free MongoDB Atlas cluster
2. Get your MongoDB connection URI

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_uri
MAX_FILE_SIZE=104857600
```

### 5. Install Dependencies

#### Install Concurrently in Root Directory
```bash
npm install --save-dev concurrently
```

#### Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## Starting the Application

There are three ways to start the application:

### 1. Start Backend and Frontend Simultaneously (Recommended)

In the project root directory, run:
```bash
npm start
```

This command will use the concurrently package to start both the backend server and the frontend server in parallel.

### 2. Start the Backend Server Separately

```bash
cd backend
npm run dev
```

The backend server will start on port 5000 (or the port specified in your `.env` file).

### 3. Start the Frontend Development Server Separately

```bash
cd frontend
npm start
```

The frontend development server will start on port 3000 and should automatically open in your browser.

## Project Structure

```
Video-converte/
├── backend/                  # Node.js/Express backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   └── src/                  # React source files
│       ├── components/       # Reusable components
│       ├── context/          # React context
│       ├── pages/            # Page components
│       ├── services/         # API services
│       └── utils/            # Utility functions
├── uploads/                  # Temporary storage for uploaded videos
└── converted/                # Storage for converted audio files
```

## Usage

1. Access the application through your web browser at `http://localhost:3000`
2. Upload a video file using the upload form (supported formats: MP4, AVI, MOV, MKV, FLV, WMV)
3. Wait for the conversion process to complete
4. Download the converted MP3 file

## File Storage

- Uploaded video files are temporarily stored in the `uploads/` directory
- Converted audio files are stored in the `converted/` directory
- Conversion history and file metadata are stored in MongoDB
- If you lose a converted file locally, you can retrieve it from the conversion history as long as the database record exists

## Limitations

- Maximum file size: 100MB (configured in `backend/config/config.js`)
- Supported video formats: MP4, AVI, MOV, MKV, FLV, WMV
- Output format: MP3 only

## Troubleshooting

### FFmpeg Not Found

If you receive an error about FFmpeg not being found:

1. Verify FFmpeg is installed by running `ffmpeg -version` in your terminal/command prompt
2. Make sure FFmpeg is correctly added to your system PATH
3. Restart your terminal/command prompt and the application

### MongoDB Connection Issues

If the application fails to connect to MongoDB:

1. Verify your MongoDB connection string in the `.env` file
2. Ensure your MongoDB server is running or Atlas cluster is accessible
3. Check network settings and firewall rules

### File Upload Issues

If file uploads fail:

1. Verify the file doesn't exceed the 100MB size limit
2. Check that the file format is supported
3. Ensure the `uploads/` and `converted/` directories exist and are writable

## Development Notes

- The backend uses ES modules (type: "module" in package.json)
- The frontend uses Create React App with Tailwind CSS
- The application uses a responsive design with custom color theming
- Tests are written using Jest for the backend and React Testing Library for the frontend
