#  SyncUp — A Social Platform for Campus Clubs

## 📖 Overview
**SyncUp** is a full-stack web platform connecting students with campus clubs.  
It allows users to:
- View clubs and public posts without logging in
- Join clubs and access exclusive content
- Create posts (for club members)
- Like and comment on posts
- Register for events hosted by clubs  

Built with **React**, **Express**, **Node.js**, **Prisma**, and **MySQL/Supabase**, SyncUp makes campus engagement fun, structured, and collaborative 🚀.

---

##  Features

###  User Authentication
- Secure **signup/login** with JWT authentication.  
- Non-logged-in users can view **public posts** and **club info**.  
- Logged-in users can **join clubs**.  
- Only **members** can access club-only posts and meetings.

###  Post System
- **Public posts** → visible to everyone.  
- **Club posts** → visible only to members.  
- Optional **image upload** & **event announcements**.  
- Like & comment features to boost engagement.

###  Clubs & Membership
- Users can **join multiple clubs**.  
- Members can post in their clubs.  
- Simple join/leave club flow.

###  Event Registration
- Clubs can create events with details.  
- Users can register directly for events.  
- Optional notifications for updates.

###  Feed & Profile
- Feed shows public + club posts (only for members).  
- Profile page displays user info & their posts.

---

##  User Flow

| User Type                   | Access Level |
|------------------------------|-------------|
| Guest (not logged in)        | View clubs + public posts only |
| Logged-in (member)           | Access club-only posts + create club posts |
| Club Coordinator / Admin     | Manage club posts/events, approve members |

1. **Guest Access**  
   - Can view all clubs and public posts.  
   - Prompted to log in to join clubs or engage with posts.  

2. **Authentication**  
   - User signs up or logs in.  
   - JWT is issued for secure sessions.

3. **Membership**  
   - Users join clubs.  
   - Only members can access club-only content.

4. **Engagement**  
   - Users can like/comment on posts.  
   - Register for upcoming events.

5. **Data Flow**  
   - Frontend → API (Express) → Prisma → Database.

---



---
