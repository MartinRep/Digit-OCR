# Adapted from https://stackoverflow.com/questions/28982974/flask-restful-upload-image#28983544
# Adapted from https://stackoverflow.com/questions/42497340/how-to-convert-one-hot-encodings-into-integers
# Adapted from https://stackoverflow.com/questions/423379/using-global-variables-in-a-function-other-than-the-one-that-created-them#423596
# Adapted from https://github.com/sugyan/tensorflow-mnist
# Adapted from https://github.com/fdivitto/ESPWebFramework

from flask import Flask, jsonify, render_template, request, make_response
from PIL import Image, ImageOps
import os
from mlearning import model
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Model
x = tf.placeholder("float", [None, 784])    # Tf variable for img input
sess = tf.Session()
sess.run(tf.global_variables_initializer())
with tf.variable_scope("convolutional"):
    keep_prob = tf.placeholder("float")
    y, variables = model.convolutional(x, keep_prob)
    y_ = tf.placeholder(tf.float32, [None, 10])
    cross_entropy = -tf.reduce_sum(y_ * tf.log(y))
    train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
saver = tf.train.Saver(variables)
saver.restore(sess, "mlearning/data/convolutional.ckpt")    # restore trained data

def convolutional(input):   # Takes in image as 1D array, returns model prediction
    return sess.run(y, feed_dict={x: input, keep_prob: 1.0}).flatten().tolist()

def getImg(file):   # process file submission
    img = Image.open(file).convert("L") # converts image to BW
    img = img.resize((28, 28), Image.LANCZOS)   # resize the image to 28x28 pixels using Lanczos model
    return img

def getCanvasImg(file): # Process Canvas image 
    imgCanvas = Image.open(file)    # open file as image
    imgCanvas = imgCanvas.resize((28, 28), Image.LANCZOS)   # Resize using Lanczos method
    img = Image.new("L", imgCanvas.size, (255)) # Creates empty BW image
    img.paste(imgCanvas, imgCanvas) # parses image to BW imgage
    img = ImageOps.invert(img)  # inverts image
    return img

# continues training of the model with user input
def uptrain_model(image, label):
    sess.run(train_step, feed_dict={x: image, y_: label})

@app.route("/")
def root():
    return render_template('index.html')

# Image from canvas and image from a file are processed slightly different
@app.route("/uploadimage", methods=['POST'])
def processImage():
    if request.files.get('imageSub',None):  #Checks for canvas or file submission
        img = getCanvasImg(request.files['imageSub'])
    else:
        img = getImg(request.files['fileSub'])
    # dev only - save processed image
    # img.save('uploads/submitted.png', format="png")
    input = (np.asarray(img, dtype=np.uint8)).reshape(1, 784)   # Reshape image to 1D array.
    prediction = np.argmax(convolutional(input), axis=0)    # Gets prediction as vector and converts it into integer
    return jsonify(prediction = str(prediction))    # sends back the result

# Process feedback from user and retrian the model with new data
@app.route("/uploadlabel", methods=['POST'])
def processLabel():
    # Gets label and converts it to hot vector array
    label = np.eye(10)[np.array(int(request.form.get("imagelabel")))]
    label = label.reshape(1,10)
    # train the model
    uptrain_model(input, label)
    # Model save to disk
    path = saver.save(
        sess, 'mlearning/data/convolutional.ckpt',
        write_meta_graph=True, write_state=True)
    print("Saved:", path)
    return render_template('thankyou.html')

# called after prediction or feedback is done
@app.route("/thankyou", methods=['GET'])
def thankyou():
    return render_template('thankyou.html')

if __name__ == "__main__":
    app.run()