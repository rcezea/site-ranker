## Database Design:
1. Users: Fields: email, passwordHash, role (user, admin).
2. Websites: Fields: url, title, description, categories, votes.
3. Categories: Fields: name, description.
4. Votes: Fields: userId, websiteId.

## Core Features
- User Authentication:
Implement JWT-based authentication for login and signup.
Protect routes for authenticated users and admin actions.


- Website Management:
Unauthenticated users can view and search websites by category.
Authenticated users can submit websites, vote/unvote.
Admins can delete websites.


- Search and Ranking:
Implement a search feature that efficiently handles large datasets.
Rank websites within categories based on the number of votes.
