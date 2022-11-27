# WORKING ON GIT
- Performs all git commands from console or from within VS Code. 

### setup new source directory for GIT
- git init
- git add .
- git commit -m "branch description"

### daily work
- git brach -b newbranchname 
- git merge "Seed-completion" --squash
- git commit -m "branch description"

## Use ISSUES for job assigning
- [Github](https://www.github.com) -> main page -> your repository name -> click  _Issues_-> _New Issue_ -> the relevant _Get Started_

- command line -> gh issue create --title "My new issue" --body "Here are more details." --assignee @me,monalisa --label "bug,help wanted" --project onboarding --milestone "learning codebase"

# GIT Commands
| Command		|	Origin		|	Destination		|	Description|
| ------ | ------ | ------ | ------ |
|git clone REPO_URL	|	Personal Github|Local			|	Creates a local copy of a Github repo. The URL can be copied  from Github.com by clicking the `Clone or Download` button.|
|git add README.md	|	Working Dir		Staging Area	|	Add "README.md" to staging area.|
|git commit		|	Staging Area    |	Local			|	Commits changes to files to the local repo.|
|git commit -a	|	Working Dir	    |	Local			|	adds and commits all file changes to the local repo.|
|git pull		|	Personal Github	|   Local			|	Retrieve any changes from a Github repo.|
|git push		|	Local			|   Personal Github	|	Sends commited file changes to Github repo.|
|git merge		|	Other branch	|   Current branch	|	Merge any changes in the named branch with the current branch.|
|git checkout -b patch1|	NA	|	NA	|	Create a branch called "patch1" from the current branch and switch to it.|
|git init		|	NA	|	NA			|	Initialise a directory as a Git repo.|
|git log		|	NA	|	NA			|	Display the commit history for the current repo|
|git status		|	NA	|	NA			|	See which files are staged/unstaged/changed|
|git diff		|	NA	|	NA	|	See the difference between staged uncomitted changes and the most recent commit|
|git stash		|	NA	|	NA		| |

## git.exe and gh.exe
- modify congif files look @ README-gitconfig
- obtain a TOKEN @ https://github.com/settings/tokens   // <TOKEN> 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 good until 3 Feb 2023
- run:  gh auth login OR populate the GH_TOKEN environment variable with a GitHub API authentication token.
- gh api -H "Accept: application/vnd.github+json"   /repos/ahmete60/haroshe/{repo|issues|milestones|state}
- curl -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer <TOKEN>" https://api.github.com/repos/ahmete60/haroshe/issues -d "{\"title\":\"Found a bug\",\"body\":\"having a problem with this.\",\"assignees\":[\"ahmete60\"],\"milestone\":1,\"labels\":[\"bug\"]}"
- more commands: https://docs.github.com/en/rest/issues 

# DEVELOPMENT FLOW   DEV-OPS

Design (Figma, materialUI) -> 
  VS Code (node.js, typescript, BE (serverless), FE (react, reactnative), AI (python, Jupyter, sagemaker)) -> 
  Test (BE (Postman), FE(CircleCI), Git Issues) -> Fix code and Commit -> CI/CD (circleCI) -> to AWS with Amplify  

TypeScript: is JavaScript’s runtime with a compile-time type checker.
Serverless Framework: provide you with full serverless application lifecycle management.

# AWS Build a Serverless Web Application
#### https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito

[![](./AWS-serverless-web-app.png)]()

AWS Lambda, Amazon API Gateway, AWS Amplify, Amazon DynamoDB, Amazon Cognito
-> elastic IP -> domain registration

# Serverless Setup and Run
#### https://www.serverless.com/framework/docs/tutorial
```sh
npm install -g serverless
serverless
...
... ddbServiceApi
... Y
... AWS Access Role

```

# GIT CI CD
#### https://resources.github.com/ci-cd/


# Using Git - 4 different ways   ![imagename](TargetUrl)  _italic_ **bold**
|  |  |
|-----|-----|
|install git CLI
|install github CLI  			     	 |       // for command line access |
|install GitHub pull requests and issues |   extention into VS code  // This should be the method of choice |
|install Gitlense					 	 |   extention into VS code  // seamlessly navigate and explore Git repositories |
|install GitHub ??Repositories       	 |   extension into VS code  // more for reviews than anything else |
|[Github.com](https://www.github.com/)   |       // online version |

## GitHub Repositories extension
The GitHub Repositories extension lets you quickly browse, search, edit, and commit to any remote GitHub repository directly from within VS Code. 

## GitHub pull requests and issues extention
#### https://github.com/Microsoft/vscode-pull-request-github/issues
**This extension is still in development, so please refer to our issue tracker for known issues, 
 issue tracker:**
This extension allows you to review and manage GitHub pull requests and issues in VS Code.

The support includes:
- Authenticating and connecting VS Code to GitHub and GitHub Enterprise.
- Listing and browsing PRs from within VS Code.
- Reviewing PRs from within VS Code with in-editor commenting.
- Validating PRs from within VS Code with easy checkouts.
- Terminal integration that enables UI and CLIs to co-exist.
- Listing and browsing issues from within VS Code.
- Hover cards for "@" mentioned users and for issues.
- Completion suggestions for users and issues.
- A "Start working on issue" action which can create a branch for you.
- Code actions to create issues from "todo" comments.
- * _PR: pull rquests_ ... PullRequests are used in open source projects.
