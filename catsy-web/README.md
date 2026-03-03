# Catsy Coffee Web Setup Guide

This guide will walk you through setting up the Catsy Coffee Web project locally, creating a new branch for your work, and pushing your changes back to the GitHub repository.

---

## 🔜 Roadmap & Next Steps

For detailed information on the next phase of development and specific implementation tasks, please refer to:
- [Transaction UI Implementation Guide](file:///mnt/datadrive/Project/CATSY/catsy-coffee-web/implement_transaction_ui.md)

## 🚀 1. Clone the Repository

First, clone the repository to your local machine. Open your terminal and run the following command:

```bash
git clone https://github.com/Domincee/catsy-coffee-web.git
```

After cloning, navigate into the project directory:
```bash
cd catsy-coffee-web
```
Next, install the project dependencies using npm
```bash
npm install
```bash
npm install
```

# 🔑 2. Environment Configuration

The web application needs to know where the API server is running.

1.  Create a new file named `.env` in the root of the `catsy-coffee-web` directory.
2.  Add the following line to the file:

```env
VITE_API_URL=http://localhost:8000
```

> [!NOTE]
> Ensure this URL matches the port your `api-bridge` server is running on (default is 8000).

# 🌿 3. Initialize Git and Create a New Branch

You can verify this by running the following command:

```bash
git status
```

if it returns repository not setup run this command:
```bash
git init
git remote add origin https://github.com/Domincee/catsy-coffee-web.git
```

# 2.2 Create and Switch to Your New Branch

first is check your branch

```bash
git branch
```

if u see a *main it means ur still in main hen run this command:

```bash
git checkout -b feature/my-task-name
```
This command will both create and switch to your new branch. You’re now ready to start making changes! 




# For pushing or stage your change to repository 
run this command 

```bash
git add .
```

```bash
git commit -m "label of your changes"
```

```bash
git push -u origin branch-name
```
if you forgot what branch
run this command:

```bash
git branch
```

an aesterisk with name is ur current branch
*currentBranch



# 3 after u have done setup

- read the file UI_review.md  for UI instruction
- read the file review_to_Api-bridge.md for connecting query database

# 4 Clone the Catsy-Api-Bridge-Server
go to https://github.com/Domincee/Catsy-API-Bridge-Server
follow the intructions
