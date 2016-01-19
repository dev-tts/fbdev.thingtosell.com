TopFriendsFaceBookWebApp
=================

Web app to obtain your best friends based on the algorithm of how friends behavior on your personal walls

### Algorithm:
The algorithm is the fundational part of this web app, it makes the decisioin who is the clostest fried of yours.

To rank your friends, I came up a algorithm based on your friends behavior on your personal. It is a way to transfer human behavior to computer science for more analysis. Behind the scene, it is not only the software, but more business values inside.

These are your friends behavior on your walls order by score from higt to low:

1. Post on your wall
2. Comment on your post
3. Click **like** on your post

Thus, let's say post on your wall will get the highest score for example **3**, and then make comment for example **2**, then click like for example **1**.

The reason to give the score like this is because **the best is rare**. Recall your personal wall, what is the most common things your friends will do on your personal wall, it is obvious to **click like**, for some friends who is much more close to us, they will **reply on your posts** sometimes, finally, **post message on you wall** when something important is going to happen for example your birthday will be the best case etc.

Based on this algorithm, each friends will get a score based on what he or she has done on your personal wall. And that is how the ranking comes from.


### Accuracy: 
Due to Facebook API did not return enough information, this ranking results are just for reference and for fun. So let’s Have Fun!


### Implement with: 
JavaScript, HTML5, CSS3, FaceBook API, jQuery, handlebars and Modernizr
