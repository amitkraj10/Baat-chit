💬 Real-Time Chat Application
📌 Project Overview
This project is a Real-Time Chat Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) with Redux for state management, WebSocket for real-time communication, and JWT for authentication.
The application allows users to register, log in, send and receive messages instantly, share media files, and see online users in real time. It also includes an AI assistant feature for smart interactions.
🚀 Features
🔐 Authentication
User Registration (Name, Email, Password, Profile Picture)
Secure Login & Logout
JWT-based authentication
Password encryption
💬 Real-Time Messaging
Instant message sending and receiving
WebSocket-based communication
One-to-one chat support
📎 Media Sharing
Send images and files in chat
Media preview in messages
🟢 Online Status
Real-time online/offline user indicator
Green dot shows active users
🤖 AI Integration
Ask AI feature inside chat
AI-generated responses for queries
🗂 User Profile
Upload profile picture
View user details
🛠️ Tech Stack
Frontend
React.js
Redux Toolkit
Socket.IO Client
Axios
CSS / Tailwind / Bootstrap
Backend
Node.js
Express.js
MongoDB
JWT Authentication
Socket.IO
Other Tools
Cloudinary / Local Storage for Media
Git & GitHub
Postman for API Testing
📂 Project Structure
Copy code

Baat-chit
│
├── Backend
│   │
│   ├── public/                  
│   │
│   └── src/
│       ├── controllers/          
│       ├── db/                    
│       ├── middleware/          
│       ├── models/               
│       ├── routes/               
│       ├── socket/                
│       ├── utils/                
│       ├── app.js                
│       ├── constant.js           
│       └── index.js               
│
├── Frontend
│   │
│   ├── public/                    
│   │
│   └── src/
│       ├── assets/                
│       ├── components/            
│       ├── hooks/                 
│       ├── pages/                
│       ├── redux/                
│       ├── socket/                
│       ├── App.jsx               
│       ├── index.css             
│       └── main.jsx               
│
└── README.md                      

🔄 Workflow of the Application
User registers and logs into the system.
Authentication is verified using JWT.
Users connect to the WebSocket server.
Messages are sent and received in real time.
Messages are stored in MongoDB.
Online users are tracked and displayed.
🔒 Security Features
JWT Authentication
Encrypted passwords
Protected API routes
Secure WebSocket communication
📈 Future Improvements
Group chat feature
Video and voice calling
Message reactions
End-to-end encryption
Push notifications
👨‍💻 Author
Amit Raj
B.Tech / Computer Science Student
