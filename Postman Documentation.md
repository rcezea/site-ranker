

### **API Documentation**

---

#### **User Endpoints**

1. **Create New User**
   - **Endpoint**: `POST /users`
   - **Description**: Creates a new user.
   - **Request Body**:
     ```json
     {
       "email": "user@example.com",
       "password": "password",
       "role": "user"  // Optional: "admin" or "user", default is "user"
     }
     ```
   - **Responses**:
     - **201 Created**:
       ```json
       {
         "id": "userId",
         "email": "user@example.com",
         "role": "user"
       }
       ```
     - **400 Bad Request**:
       ```json
       {
         "error": "Missing email"
       }
       ```

2. **Get User Info**
   - **Endpoint**: `GET /users/me`
   - **Description**: Retrieves information about the currently authenticated user.
   - **Headers**:
     - `x-token`: Authentication token
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "id": "userId",
         "email": "user@example.com"
       }
       ```
     - **401 Unauthorized**: If the user is not authenticated

3. **Delete User**
   - **Endpoint**: `DELETE /users/destroy`
   - **Description**: Deletes a user. Requires admin role.
   - **Request Body**:
     ```json
     {
       "delete_user_id": "userId"
     }
     ```
   - **Responses**:
     - **204 No Content**:
       ```json
       {
         "message": "Account deleted"
       }
       ```
     - **400 Bad Request**: If the user does not exist
     - **401 Unauthorized**: If the user is not an admin

---

#### **Authentication Endpoints**

1. **Connect**
   - **Endpoint**: `POST /connect`
   - **Description**: Authenticates a user and returns a token.
   - **Headers**:
     - `Authorization`: Basic Auth header (`Basic base64(email:password)`)
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "token": "authToken"
       }
       ```
     - **401 Unauthorized**: If authentication fails

2. **Disconnect**
   - **Endpoint**: `DELETE /disconnect`
   - **Description**: Logs out a user by invalidating the token.
   - **Headers**:
     - `x-token`: Authentication token
   - **Responses**:
     - **204 No Content**: Successful logout
     - **401 Unauthorized**: If the user is not authenticated

---

#### **Site Endpoints**

1. **Create New Site**
   - **Endpoint**: `POST /sites`
   - **Description**: Adds a new site entry.
   - **Headers**:
     - `x-token`: Authentication token
   - **Request Body**:
     ```json
     {
       "siteUrl": "https://example.com",
       "siteName": "Example Site",
       "siteDesc": "Site description",
       "siteCategories": ["category1", "category2"]
     }
     ```
   - **Responses**:
     - **201 Created**:
       ```json
       {
         "id": "siteId",
         "userId": "userId",
         "url": "https://example.com",
         "title": "Example Site",
         "desc": "Site description",
         "categories": ["category1", "category2"],
         "votes": 0
       }
       ```
     - **400 Bad Request**: If validation fails

2. **Vote for a Site**
   - **Endpoint**: `PUT /sites/:id/vote`
   - **Description**: Votes for a site. Allows only one vote per user per site.
   - **Headers**:
     - `x-token`: Authentication token
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "url": "https://example.com",
         "title": "Example Site",
         "votes": 1
       }
       ```
     - **400 Bad Request**: If the user has already voted or site is invalid
     - **401 Unauthorized**: If the user is not authenticated

3. **Unvote a Site**
   - **Endpoint**: `PUT /sites/:id/unvote`
   - **Description**: Removes a vote from a site.
   - **Headers**:
     - `x-token`: Authentication token
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "url": "https://example.com",
         "title": "Example Site",
         "votes": 0
       }
       ```
     - **400 Bad Request**: If the user has not voted or site is invalid
     - **401 Unauthorized**: If the user is not authenticated

4. **Update Site Category**
   - **Endpoint**: `PUT /sites/:id/update`
   - **Description**: Adds a category to an existing site.
   - **Headers**:
     - `x-token`: Authentication token
   - **Request Body**:
     ```json
     {
       "category": "newCategory"
     }
     ```
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "message": "Site updated"
       }
       ```
     - **400 Bad Request**: If the category is already included or invalid
     - **401 Unauthorized**: If the user did not add the site or is not the admin.

5. **Delete a Site**
   - **Endpoint**: `DELETE /sites/:id/delete`
   - **Description**: Deletes a site. Requires admin role.
   - **Headers**:
     - `x-token`: Authentication token
   - **Responses**:
     - **204 No Content**:
       ```json
       {
         "message": "Site deleted successfully"
       }
       ```
     - **400 Bad Request**: If the site is invalid
     - **401 Unauthorized**: If the user is not an admin

6. **Create Category**
   - **Endpoint**: `POST /category`
   - **Description**: Creates a new category. Requires admin role.
   - **Headers**:
     - `x-token`: Authentication token
   - **Request Body**:
     ```json
     {
       "name": "categoryName",
       "desc": "category description"
     }
     ```
   - **Responses**:
     - **201 Created**:
       ```json
       {
         "message": "Category created"
       }
       ```
     - **400 Bad Request**: If the category already exists or required fields are missing
     - **401 Unauthorized**: If the user is not an admin

7. **Delete Category**
   - **Endpoint**: `DELETE /category`
   - **Description**: Deletes a category. Requires admin role.
   - **Headers**:
     - `x-token`: Authentication token
   - **Request Body**:
     ```json
     {
       "name": "categoryName"
     }
     ```
   - **Responses**:
     - **204 No Content**:
       ```json
       {
         "message": "Category deleted"
       }
       ```
     - **400 Bad Request**: If the category does not exist
     - **401 Unauthorized**: If the user is not an admin

8. **Get Categories**
   - **Endpoint**: `GET /category`
   - **Description**: Retrieves a list of all categories.
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "categories": ["category1", "category2"]
       }
       ```

9. **Get All Sites**
   - **Endpoint**: `GET /sites/all`
   - **Description**: Retrieves a list of all sites.
   - **Responses**:
     - **200 OK**:
       ```json
       {
         "sites": [
           {
             "title": "Example Site",
             "url": "https://example.com",
             "desc": "Site description",
             "categories": ["category1"],
             "votes": 10
           }
         ]
       }
       ```

10. **Search Sites**
    - **Endpoint**: `GET /sites`
    - **Description**: Searches for sites based on query and filters.
    - **Query Parameters**:
      - `query`: Search query (string)
      - `categories`: Comma-separated list of categories (optional)
      - `page`: Page number (default: 1)
      - `limit`: Number of results per page (default: 20)
    - **Responses**:
      - **200 OK**:
        ```json
        {
          "sites": [
            {
              "title": "Example Site",
              "url": "https://example.com",
              "desc": "Site description",
              "categories": ["category1"],
              "votes": 10
            }
          ],
          "pagination": {
            "page": 1,
            "limit": 20,
            "totalPages": 5,
            "totalSites": 100
          }
        }
        ```