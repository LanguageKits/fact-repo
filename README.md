# fact-repo: Repository of Facts and Misinformation


## Getting Started
 - Fork the repo to either start your own annotation project or to contribute to fact-repo
 - If you have data annotated that you want to add to the fact-repo repository, please do a pull request
## Data Scrape
- In the Scripts folder we have included a basic scrape script
- To run the script you must have a github account with push permissions to a repository
- The script will ingest urls.txt which should contain a list of urls and a category for each url
## Annotator Tools
**Build:**
- Download npm from https://nodejs.org/en/
- Open your command prompt / terminal.
- Go to "fact-repo-annotator".
- Type "npm install". This will install the required node_modules. It may take a while.

**How to run:**
- Open your command prompt / terminal.
- Go to "fact-repo-annotator".
- Type "yarn start". This will start the application in your browser

**Client ID**
You will need a personal token to annotate. Generate one for your account with repo access at
https://github.com/settings/tokens

**Loading a File**
- Enter your client ID
- Select a File to annotate (you just need to swicth the _x to the number you want) 

**Annotation**
You have 7 options on each sentence
- Fact
- Misinformation : Stated as a fact but incorrect
- Opinion : Not stated as a fact but as a persoanl opinion
- Temporal : Whether Fact or Misinformation, it is only true/false for the time period it was said
- None : It is a statement but none of the above apply
- Ignore : No really a statement, usually text from the web that is of no importance

**Additional**
- Author: If the url has an author, add it as well in the document meta data
- Annotator: Add yourself here

## Analysis
- in the Analysis directory you will find a few basic scripts written in Jupyter Labs
- LoadData will show how to ingest the JSON files and how to select particular categories for analysis or machien learning
- BasicModel will show how to ingrest the data and feed it into Scikit for machine learning 
