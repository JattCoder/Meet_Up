# README

Meet Up

In Meet Up users can search for places near by or search for places at specific places all over the world, if users simply type in place, Meet Up will look for places near the user's location. Ex: Starbucks, Meet Up will look for starbucks near me or user can search for location at specific place. Ex: Starbucks in California (Using State) or Starbucks in LA (Using City) or Starbucks in 90001 (Using Zip-Code).

If user doesn't have any preference, user can simply type in Coffee or Coffee in (City or State or Zip-Code), Meet Up will populate the map with locations.

After selecting the location, user can choose to add selected location in favorites or get directions to selected location. Route will displayed on map and user will option to add stops, cancel route or start the navigation. 

If user want to add stops - When route is displayed on map, user can simply search for another location or find location on map manually and click on that location and choose Add Stop, Meet Up will automatically look for best route possible or user can edit the route by avoiding highways, tolls or ferries.

Stops can be added as many as user wants, Meet Up will find route unless Stop is overseas. If stop or destination is unreachable, Meet Up will look for airports near by the user, so user can take flight to destination.

After done selecting destination and stops (if any), user can click on start and Meet Up will start the navigation to destination.

Meet Up utilizes JS front-end and Rails API back-end with Active-Record SQL Database.

Getting Started
To get started using this app do the following:

Clone the repository
1. git clone https://github.com/JattCoder/Meet_Up.git

--- Run commands in your editor console ---

Install Missing Gems
2. bundle install

Migrate the tables
3. rake db:migrate

Start Rails Server
4. rails s   ---> Start Rails Server

Navigate to JS front-end
5. cd front_meetup

Start HTML Server
6. npx reload -b

Enjoy Searching and Navigating to places

If you have any feedback for my application, don't hesitate to let me know. Thank you for checking it out!
# Meet_Up
