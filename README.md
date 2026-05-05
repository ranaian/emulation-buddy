# emulation-buddy
web app to find console emulators by video game titles using wikipedia api 

## LIVE PAGE
> https://emulation-buddy.onrender.com/
<hr>

## Design Choices

* Emulation Buddy is primarily vanilla js , with an ejs frontend to manage the login status. 
* The backend is postgreSQL because that's what i have the most famililarity with. \
* The database has four tables of varying utility - Users, Games, Consoles, and Games-Consoles
  * the average user has no need to login to the website, but the login authorization is managed by google OAuth2.0
  * users are marked "is_admin"=FALSE by default. the sole purpose of the "is_admin" column is to hide management utilities from the average user - preventing them from updating consoles.emulator_name and consoles.emulator_url
  * Games is a list of games that have been previously queried from Wikipedia, reducing the number of scraper API calls sent to Wikipedia, for which i have explicitly labeled the bot such that the Wikipedia servers know it's an automated action and don't IP ban me :) The games.id serves as a foreign key in the Games-Consoles table.
  * Consoles is a list of consoles that have been scraped from Wikipedia as a result of game queries. I, as the admin, have the ability to populate the fields console.emulator_name and console.emulator_url such that when users query games from the buddy, the console associated with that game can have the name and source link of its console emulators provided to the user. this is the primary function of the website. 
  * Games-Consoles is an association table, holding a many-many relationship between games.id and consoles.id, such that when a user queries a game, if it doesn't exist in the database, the game title gets added to games.name, the consoles table is checked for the consoles.name(s) associated with that game, and if not found added to the database, then that/those consoles.id(s) are paired with that games.id in the games-consoles table. 
  * in a future update, I as the admin will be able to pull up a list of all games stored in the database. the only purpose of this function will be to allow me to remove from the database entries where the title of the game as stored in the database matches the (series) page on wikipedia, which i have not at pres time added any error handling for. Because I will be presumably looking at actual game titles in this process, i'll likely be manually sending a query through the API to the correct (video_game) wikipedia page, rather than deleting the entry outright. Currently, the only way to manage this is to delete the entry from the database and resubmit a query with the exact wikipedia slug of the game in question, to make sure it populates in the database correctly with the proper relationships. 
## Challenges
* I had many technical hurdles with this project, many of which stemmed from not reading the documentation of infobox-parser, and many of which stemmed from not having the time to make sure I was using google OAuth2.0 correctly. 
* I've had a lot of difficulties associated with making sure I'm reading the data from the scraper correctly, difficulty with managing (or not managing) wikipedia redirects correctly, I haven't yet added checking to ensure i'm fetching data from video game pages only, as well as handling receiving a category page in place of a game entry. 
  * I.E. the first game in the Killzone series is titled Killzone, so the default Wikipedia page reached is https://en.wikipedia.org/wiki/Killzone when the page I actually want to fetch is https://en.wikipedia.org/wiki/Killzone_(video_game). This applies to every game for which the series title is also the title of one of the games, or for which the name of the game redirects to a category page. 
  * On an interesting but frustrating note, there's a particular parsing problem for games in the Pokemon series, that I've also noticed for games for which the Wikipedia redirect is a shortened version of the actual game title. For Pokemon games, their Wikipedia entries are in the format https://en.wikipedia.org/wiki/Pok%C3%A9mon_Ruby_and_Sapphire but the scraper only stores "Pokémon Ruby" in the database. 
  * As for other games, for example, the query "Jak and Daxter (video game)" correctly redirects to https://en.wikipedia.org/wiki/Jak_and_Daxter:_The_Precursor_Legacy but only "Jak and Daxter" is stored in the database. 
  * All other information is correctly stored, and searching for paired Pokemon games correctly returns the version listed first in the wikipedia page (i.e. "Pokemon Silver" redirects to https://en.wikipedia.org/wiki/Pok%C3%A9mon_Gold_and_Silver, which the database stores as "Pokémon Gold" but correctly contains "Platform: Game Boy Color"). 
  * This is an amount of error handling that I do plan to implement in the future, but have not yet had the opportunty to so. 
* For the longest time, the database wasn't storing anything in the games.wikipedia_slug field, which it's supposed to use to store the entire literal slug of the fetched page, but after updating it to at least function, it's still only storing the underscore-spaced version of the query that provided the successful redirect to the actual page. I'm sure I've simply assigned it to be an underscore-spaced version of the query, but that's probably only because fetching it from infobox-parser wasn't working. 
* I did have to specifically mark the crawler as an automated tool because it's potentially capable of making a large number of Wikipedia API calls in a very short period of time, and if I didn't include in the request headers "I am a bot, email me here if there's a problem", Wikipedia would absolutely IP ban me 
* Most of the other problems involved making sure I was passing the right data to functions, referencing the data in the correct format, and figuring out which things needed to be arrays and which things had to be returned as array indices to get the data to populate correctly on both the frontend and the backend. 
* Because it was the last thing I added, there was some difficulty in making sure that the login feature was both working properly and pulling the right data to make sure that the "isAdmin" functions were correctly finding users.is_admin and displaying the editing tools appropriately. The greatest hurdle was probably figuring out that the google OAuth2.0 login stores emails as an array even when logging into a service as a single user, which I was only able to figure out after adding console logging progress checking to every step of the login process, eventually finding that the function was receiving an array instead of an email address. 
## Learning Outcomes
* I feel like I've learned a moderate amount about full-stack development, namely that data type mismatches, data name mismatches, and typos are the actual devil
* For deployment, I feel like I haven't learned much beyond how relatively simple it is to use services like Render and, despite my problems, Google's OAuth2.0. 
* In the future I plan to replace my PC with a more modern machine, as my home PC is about 7 years old now. When I do this, I plan to use this machine as a private server, and I'd like to know how to do a full deployment locally hosted rather than relying on cloud servers and services to store my data and code. 
## Future Work
* As mentioned, in the future Emulation-Buddy will require the ability to update and remove bad and incorrect data from the website instead of just from the database, but because scrolling through every game saved in the database isn't a baseline feature of the buddy, I didn't have time to implement this part of database management in the frontend. I imagine I'll implement the same structure of table as I currently use to display the table of Consoles, but with the ability to update entries in the games-consoles table such that game series don't link to the "expandable list" that appears when you accidentally reach a video game series category page, as well as the ability to remove those "expandable list"s from the consoles table
* Additionally, error handling will be required to make sure that the majority of the time these custodial tools are unneccessary, with more robust handling to ensure that games pages are found before game series pages, as well as correctly saving the wikipedia slug for purposes of either linking to the wikipedia page, or ensuring that the proper title of the game is saved and displayed
<hr>

## Currently Known Bugs
* <s>page does not refresh after auto-posting a query into the database</s>
  * not a bug on the live page
* <s>consoles in database do not relate to each other, multiple entries per console is not ideal </s>
  * 4/22/26 14:55 : typo in "Playstation 3" in seeded data corrected to "PlayStation 3" matching parse data, database relation was always functioning
* unexpected behavior on unexpected inputs
  * obviously
* Pokemon games auto-group by generation name but do not save as group or differentiate
  * i.e. "Pokemon Ruby" returns "Pokemon Ruby" and stores "Pokemon Ruby" in the database
    * subsequently searching "Pokemon Sapphire" returns "Pokemon Ruby" and adds nothing to the database, because the actual wikipedia page is "/Pokémon_Ruby_and_Sapphire"
  * I don't know why it doesn't save the whole name
* when searching a game where the name of the game is also the title of the series, it defaults to the category page and not the "_(video_game)" page and ends up displaying "collapsible list" in the console table

## To-Do List
* <s>form to submit emulators to the database</s>
* clean up database
* clean up code
* css styling 

### Dmoe
> https://drive.google.com/file/d/1VHaNwKodbifMGU7UnCAGCUv-SycgFuSB/view?usp=sharing

