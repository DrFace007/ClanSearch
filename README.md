# Destiny Clan Search

This project allows for searching of some of the Destiny Clans.

## Data Coverage

- Should contain most clans created from August 18, 2016 to July 25, 2024
- Data obtained using Bungie API's GroupV2.GetGroup method

## Database

The MongoDB database can be found here:
[Google Drive Link](https://drive.google.com/drive/folders/1KhtOocu8KJnBUeNBaYv90ERnruYtxJyw?usp=sharing)

Restore with `mongorestore` to your local MongoDB instance.

## Prerequisites

- Node.js installed: https://nodejs.org/
- Netlify account: https://www.netlify.com/
- Netlify CLI (installation instructions below)

## Setup Instructions

1. Install Netlify CLI: https://docs.netlify.com/cli/get-started/
   
   `npm install netlify-cli -g`
   
2. Log in to Netlify:
   `netlify login`

3. Create environment variables on your local machine:
- Name: `MONGODB_URI`
  Value: `mongodb://localhost:27017/`
- Name: `USE_ATLAS_SEARCH`
  Value: `false`

4. Clone the repository and navigate to the project directory:
   ```
   git clone https://github.com/DrFace007/ClanSearch.git
   cd ClanSearch
   ```
   
5. Install dependencies:
   `npm install mongodb`

6. Launch the local web server:
   `netlify dev`

This will start the site on your local machine using the local mongo db.
