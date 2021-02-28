# fact-repo: Repository of Facts and Misinformation


## Getting Started

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
