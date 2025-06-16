# Nestigo Hotel Booking (Airbnb Listing) 🌏

This project is a replica of Hotel Booking Website (Airbnb Listings) 🏨

## Tech Stack Used:-

### (For Frontend)
1. HTML
2. CSS
3. JAVASCRIPT

### (For Backend)
4. FLASK 

### (APIs Used)
5. Google Places Autocomplete
6. Rapid Api (Airbnb)
7. Stripe Payment Gateway
8. Auth0 (for user authentication during sign in or sign up)

### (For Database)
9. MongoDB Atlas

The basic project flow is simple 🚀:- 

The user visits our "Home Page (index.html)" and Signs in or Signs Up either through their email and password or through their social logins(recommended). After successfully signing up, their profile updates and shows up with a dropdown attached showing their Booking History and Logout buttons. The user can easily download their past bookings in a pdf format from there. THen in the search box, the user can type in any place or location where they want to find the airbnb listings and clicks on search button. 

It redirects the user to "Hotel Results page (hotelslist.html)" where the destination box will be retrieved automatically what the user had searched in the home page. The user can provide their check in and check out date, number of person and rooms data, and will click on search to find the list of all airbnb listings present in that location. There is a feature of "Search on Map" which will redirect you to google maps page and will show all the hotels present in that location.

The user will choose the airbnb and click on Book Now option which will redirect them to Stripe Payment Gateway, and the user will provide the email, they want their booking confirmation to receive and click Book Now for successful completion of their purchase. After this step, a confirmation email will be sent to the registered email, and the recent booking will show up in the Booking History area. All of these info gets retrieved to the database provided.

### If you face error regarding CORS in the console and your MongoDB is not getting connected, then probably you will have t choose a lower version of Python to run shuch as Python 3.9.x or something, then download your dependencies again and run your app again, this time it will not cause any error.
