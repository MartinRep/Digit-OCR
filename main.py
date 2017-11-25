# https://stackoverflow.com/questions/28982974/flask-restful-upload-image#28983544
from flask import Flask, jsonify, render_template, request, make_response
from PIL import Image
import os
import keras as kr

app = Flask(__name__)
 
def saveImg(file, path):
    img = Image.open(file)
    img = img.resize((28, 28), Image.LANCZOS)
    jpeg_img = Image.new("RGB", img.size, (255,255,255))
    jpeg_img.paste(img, img)
    jpeg_img.save(path)

def getPrediction(img):
    # Get prediction from pretrained model
    return 0

@app.route("/")
def getImage():
    return render_template('index.html')

@app.route("/uploadimage", methods=['POST'])
def processImage():
    file = request.files['imageSub']
    saveImg(file, 'uploads/submitted.jpg')
    return render_template('index.html')
 
if __name__ == "__main__":
    app.run()