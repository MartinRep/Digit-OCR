# https://stackoverflow.com/questions/28982974/flask-restful-upload-image#28983544
from flask import Flask, jsonify, render_template, request, make_response
import os
app = Flask(__name__)
 
@app.route("/")
def getImage():
    return render_template('index.html')

@app.route("/uploadimage", methods=['POST'])
def processImage():
    file = request.files['myfile']
    # extension = os.path.splitext(file.filename)[1]
    file.save('uploads/'+file.filename)
    return make_response("success")
 
if __name__ == "__main__":
    app.run()