# emulation-buddy
web app to find console emulators by video game titles using wikipedia api 

## LIVE PAGE
> https://emulation-buddy.onrender.com/
## Currently Known Bugs
* page does not refresh after auto-posting a query into the database
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
* form to submit emulators to the database
* clean up database
* clean up code
* css styling 

### Dmoe
> https://drive.google.com/file/d/1VHaNwKodbifMGU7UnCAGCUv-SycgFuSB/view?usp=sharing

