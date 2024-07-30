# get-proctored.ai

---

Public repository for the Proctored.ai project. This repository contains the code for the Proctored.ai project. The project is a web application that allows users to take proctored exams online. The application uses facial recognition technology to verify the identity of the user and prevent cheating during the exam. The application also records the user's screen and webcam during the exam to ensure that the user is not using any unauthorized resources. The application is built using Next.js, MediaPipe, mongodb, Express and TensorFlow.js. Made as a part of our 6th semester project at IIIT, Lucknow.

## Features

After starting the backend and frontend servers ([instructions here](#installation)), you can access the application by visiting <http://localhost:3000> in your browser.

The application allows users to create an account, log in, and take proctored exams. The application uses facial recognition technology to verify the identity of the user and prevent cheating during the exam. The application also records the user's screen and webcam during the exam to ensure that the user is not using any unauthorized resources.

- User authentication: Users can create an account, log in, and log out of the application.
- Proctored exams: Users can take proctored exams using the application. The application uses facial recognition technology to verify the identity of the user and prevent cheating during the exam.
- Screen recording: The application records the user's screen during the exam to ensure that the user is not using any unauthorized resources.
- Webcam recording: The application records the user's webcam during the exam to ensure that the user is not using any unauthorized resources.
- Exam analytics: The application provides analytics on the user's performance during the exam, including the number of questions answered correctly and incorrectly.

## Contributing

If you would like to contribute to the project, you can fork the repository and submit a pull request with your changes. We welcome contributions from the community and appreciate any feedback or suggestions you may have.

## Installation

To run the project, you need to have Node.js, yarn installed on your system. You can download Node.js from the official website: <https://nodejs.org/en/download>. You can install yarn using npm by running the following command:

```bash
npm install -g yarn
```

Make sure you follow installation instructions for MediaPipe from the official website if you face any issues during installation: <https://google.github.io/mediapipe/getting_started/install.html>.

After installing Node.js, you can clone the repository and install the dependencies by running the following commands:

```bash
git clone https://github.com/chakri68/get-proctered-pulic.git
cd get-proctored-public

cd backend-express
yarn

cd ../client
yarn
```

## Running the project

To start the backend server, run the following command:

```bash
cd backend-express
yarn dev
```

To start the frontend server, run the following command:

```bash
cd client
yarn dev
```

---

Made as a part of our 6th semester project at IIIT, Lucknow.

Collaborators:

- [Aryaman](https://github.com/AcidicArmadillo)
- [Anu Priya](https://github.com/annupriy)
- [Sahil Singh](https://github.com/SahilSingh177)
- [Savarna Chandra](https://github.com/savarnachandra20)
- [Chakradhar Reddy](https://github.com/chakri68)
