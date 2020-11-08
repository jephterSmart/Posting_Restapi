# REST API Aplication for Posting Application
This Rest Api has 12 End point that you as a user can reach and you can use to do specific things.

This Rest Api allow you save your contents on the server and can give you those content anytime you want them. But to that you first have to be authenticated and authorized.

## Features
* Authentication
* Authorization
* Validation
* Server Storage

## End points
* `/signup` - This endpoint allows you to put in your signup informations as payloads to the `body` of the post request. These information are:
    1. `name` of the user that is signing up
    2. `email` of the user that is signing up
    3. `password` of the user that is signing up.
    
    This Endpoint will return to you the payload in json format:
    1. The `message` and
    2. The `UserId` for the user just created . 
* `/login` - This endpoint allow you to login into the application. All you need supply as payload of the `body` are:
    1. `email` of the user that has already sign up for this restapi and 
    2. `password` of the user that has already sign up for this restapi.

    This Endpoint will return to you the payload in json format:
    1. The `token` which have the two nodes - `email` and `UserId` and 
    2. The `message` for the user just logged in.
* `/posts` - This Endpoint uses the **GET** method to give the user all the information he has ever uploaded on the server. This page does use pagination to limit the number of user information and load on the network. The default number of post you can get is 2. Here you dont supply any payload. The body of the `response` will be:
    1. `message` stating whether it was succesful or not.
    2. `posts` the post themselves.
    3. `totalItems` states the number of items which is by default is 2 since we specify our pagination to be 2.
> Note that you must pass us your authentication token everytime, so that we can validate you.

* `/post` - This is a **POST** Endpoint that allows you to create a post. All you need supply as payload of the `body` are:
    1. `title` of the post that we want to create and 
    2. `content` of the post that we want to create.
    2. `image` we want to upload to represent our content.

    This Endpoint will return to you the `response` payload in json format:
    1. The `message` which state whether the creation was successful or not 
    2. The `post` we created.
    3. The `creator` of the post.
* `/post/:postId` - This is a **GET, PUT and DELETE** method Endpoint that allows you to get the particular post that you have entered earlier the `:postId` can be gotten from `post` *response payload* that was given in the `/post` endpoint when you created a post. The *response* of this endpoint are:

        1. `message` that states whether the retrieval was successful or not.
        2. `post` gives the post whose postId we requested for. 

    *Note the place of **`/:postId`** should be replace with a particular postId value.* 

    When using the **PUT** method, that means we are trying to *update this post* hence we need to specify either of the following payload we want to change:
    1. `title` of the post that we want to update and 
    2. `content` of the post that we want to update.
    2. `image` we want to upload to represent our content.

    This Endpoint will return to you the `response` payload in json format:
    1. The `message` which state whether the update was successful or not 
    2. The `post` we updated.
    
 When using the **DELETE** method, that means we are trying to *Delete this post* that its `:postId` is specified.This Endpoint will return to you the `response` payload in json format:

    1. The `message` which state whether the deletion was successful or not. 
    
    2. The ` post ` that was requested to be deleted.


* `/status` - This Endpoint is a **GET and a POST** method. It allow us to check status of the application.

## Thanks for your time.
To use this API [**Click here**](https://uzezijephter-restapi.herokuapp.com "Rest api")