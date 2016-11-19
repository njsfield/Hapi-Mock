## Hapi Specificity 

In Hapi, routes that match paths with higher specificity win...

Route 1 : path = '/{stuff*}'  
Route 2 : path = '/files/{file}/me.jpg' 

Get request Path = '/file/nick/me.jpg'

Winner = **Route 2**.

## Goal 

Demonstrate how routes can be compared against a live get request path to match the more specific route.
Use a fake .get method (like server.inject)
