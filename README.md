## [API Documentation Here](https://github.com/rcezea/site-ranker/blob/main/Postman%20Documentation.md)
## [Postman Published Documentation (without example response)](https://documenter.getpostman.com/view/36640024/2sA3rxrtdn)

## Database Design:
1. Users: Fields: email, password, role (user, admin).
2. Websites: Fields: url, title, description, categories, votes.
3. Categories: Fields: name, description.
4. Votes: Fields: userId, siteId.

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

## Remaining Considerations:
- Security: I need to ensure that all endpoints are secure, with proper authentication and validation to prevent unauthorized access.
- Testing: I need to prepare unit tests to cover various scenarios and edge cases.
- Error Handling: I need to improve error handling and exceptions.
- Performance: I did not access performance
- Modularity: The project could do with better modularity and less repeated logic.
- Deployment: Maybe not
- Documentation & API Documentation: After I get back twice the hours I put into this in sleep hours...
