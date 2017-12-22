# WhereTo
WhereTo is an App feathering GoogleMap API combined with Foursquare to help you explore the city

### Dependency
You need:
1, jQuery
2, KnockoutJS
3, Internet
to run this application on your machine

### How it works
1, first clone the repo to your machine by
~~~
git clone https://github.com/maniacalmm/WhereTo.git
~~~

2, upon opening the index.html, default location is set to Tokyo,JP (since that's where I live), and you can get 30 recommended place under the category of arts & entertainment.

3, you can choose different category by using the dropdown menu, after you made a decision, click apply to get the recommended locations.

4, left sidebar feathering all the locations' name, by clicking any of them, corresponding markers on the map will bounce and display more detailed info, you can click again to make the bouncing stop, and corresponding info will show below the item list in red block.

5, you can also hide the sidebar by clicking the HIDE/SHOW button or the little arrow button.

6, when typing into the space above sidebar, results will be filtered by what you typed, as well as the markers on the map.

7,this app works globally, it always try to get the venues based on your current browsing location

8, directly click the marker will also trigger the popup window

9, list item and marker on the map are bidirectionally binded, click one will trigger the other, and there will only be one 'actived' spot at any given time


## Have fun :)