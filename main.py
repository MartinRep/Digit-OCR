# https://stackoverflow.com/questions/28982974/flask-restful-upload-image#28983544
from flask import Flask, jsonify, render_template, request, make_response
from PIL import Image, ImageOps
import os
import keras as kr
from mlearning import model
import tensorflow as tf
import numpy as np

app = Flask(__name__)
 
x = tf.placeholder("float", [None, 784])
sess = tf.Session()

# restore trained data
with tf.variable_scope("convolutional"):
    keep_prob = tf.placeholder("float")
    y2, variables = model.convolutional(x, keep_prob)
saver = tf.train.Saver(variables)
saver.restore(sess, "mlearning/data/convolutional.ckpt")

def convolutional(input):
    return sess.run(y2, feed_dict={x: input, keep_prob: 1.0}).flatten().tolist()

def getImg(file):
    img = Image.open(file).convert("L")
    img = img.resize((28, 28), Image.LANCZOS)
    return img

def getCanvasImg(file):
    img = Image.open(file)
    img = img.resize((28, 28), Image.LANCZOS)
    imgCanvas = Image.new("L", img.size, (255))
    imgCanvas.paste(img, img)
    imgCanvas = ImageOps.invert(imgCanvas)
    return imgCanvas

def getPrediction(img):
    # Get prediction from pretrained model
    return 0

@app.route("/")
def getImage():
    return render_template('index.html')

@app.route("/uploadimage", methods=['POST'])
def processImage():
    
    if request.files.get('imageSub',None):
        img = getCanvasImg(request.files['imageSub'])
        print('Image')
    else:
        img = getImg(request.files['fileSub'])
        print('File')
    img.save('uploads/submitted.png', format="png")
    # jpeg_img.save('uploads/submitted.jpg')
    # input = (np.asarray(jpeg_img, dtype=np.uint8)).reshape(1, 784)
    # output = convolutional(input)
    # print(convolutional(input))
    input = (np.asarray(img, dtype=np.uint8)).reshape(1, 784)
    print(convolutional(input))
    output = convolutional(input)
    return jsonify(result=output)
 
if __name__ == "__main__":
    app.run()