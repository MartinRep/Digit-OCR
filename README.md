# Digit-OCR
Digit recognition Web app using Flask and TensorFlow. This project was created as a part of 4th year module of Software Development course in [GMIT](www.gmit.ie). 

## Technology
For this web application we used [Flask](http://flask.pocoo.org/) framework and [Tensorflow](https://www.tensorflow.org/) library for machine learning.

## Prerequirements
 - [Python](https://www.python.org/downloads/) Tested on version 3.6
 - Flask `pip install flask`
 - Numpy library `pip istall numpy`
 - Tensorflow   `pip install tensorflow`
 - PIL   `pip install pillow`
 
 ### How to run the app
 - Navigate to folder you downloaded the project.
 - Make sure all dependencies are installed.
 - Run `python main.py`
 - Navigate your browser to `localhost:5000`
 
## Machine Learning model
Prediction model was trained using [MNIST](https://en.wikipedia.org/wiki/MNIST_database) data set.
Fully trained model is located in `/mlearning/data/` folder under `convolutional.ckpt` file.

## Usage
Model will predict with high probability canvas or file input. If prediction is incorrect, user can correct it and app will adjust, retrain the model.

![demo](https://github.com/MartinRep/Digit-OCR/blob/master/assets/demo.gif)
