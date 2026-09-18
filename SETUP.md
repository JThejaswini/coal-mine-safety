\# Coal Mine Safety System — Setup Guide



\## 1. Clone the Repository



```powershell

git clone https://github.com/JThejaswini/coal-mine-safety.git

cd coal-mine-safety

```



\## 2. Required Software



Install these before continuing:



\* Git

\* Node.js and npm

\* PostgreSQL

\* Python 3.x



\## 3. Install Backend Dependencies



```powershell

cd backend

npm install

```



\## 4. Install Frontend Dependencies



Open another PowerShell window:



```powershell

cd coal-mine-safety

npm install

```



\## 5. Create the PostgreSQL Database



Open PostgreSQL/psql and create the database:



```sql

CREATE DATABASE coal\_mine\_safety;

```



Then connect to it:



```sql

\\c coal\_mine\_safety

```



Import the database dump from the project root:



```powershell

psql -U postgres -d coal\_mine\_safety -f coal\_mine\_safety.sql

```



Enter the PostgreSQL password when prompted.



\## 6. Environment Variables



If the project requires `.env` files, create them based on the existing project configuration.



Do not commit passwords, JWT secrets, or other private credentials to GitHub.



\## 7. Python AI Server



From the project root:



```powershell

python -m venv ai-env

.\\ai-env\\Scripts\\activate

```



Install the required Python packages according to the AI server dependencies.



\## 8. Start the Backend



```powershell

cd backend

npm run dev

```



Keep this terminal running.



\## 9. Start the Frontend



Open another PowerShell window:



```powershell

cd coal-mine-safety

npm run dev

```



Keep this terminal running.



\## 10. Start the AI Server



Open another PowerShell window:



```powershell

cd "coal-mine-safety"

.\\ai-env\\Scripts\\activate

uvicorn ai\_server:app --reload

```



\## 11. Important



Do not commit these to GitHub:



\* `.env`

\* `node\_modules`

\* `ai-env`

\* Python virtual environments

\* AI model files



If any command gives an error, stop and share the complete error message with the project owner before changing the source code.



