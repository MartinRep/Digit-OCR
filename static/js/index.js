// Adapted from https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse#8398189
// Adapted from https://stackoverflow.com/questions/12168909/blob-from-dataurl
// Adapted from https://stackoverflow.com/questions/9334636/how-to-create-a-dialog-with-yes-and-no-options#9334684

function constructor()
{
    var main = this;
    this.flag = false,
        this.prevX,
        this.prevY,
        this.currX = 0,
        this.currY = 0,
        this.strokeColor = "black",
        this.drawWidth = 10;
    this.canvas = document.getElementById('can');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUpOrOut.bind(this));
    this.canvas.addEventListener('mouseout', this.onMouseUpOrOut.bind(this));
}

function onMouseDown(e)
{
    this.currX = e.clientX - this.canvas.offsetLeft;  //Sets start position for drawing
    this.currY = e.clientY - this.canvas.offsetTop;
    this.flag = true;
}

function onMouseMove(e)
{
    if(this.flag)
    {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;
        this.draw();
    }
}

function onMouseUpOrOut()
{
    this.flag = false;
}

function init() 
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    $("#confirmBox").hide();
    $("#labelBox").hide();
}

function draw() 
{
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.drawWidth;
    this.ctx.stroke();
    this.ctx.arc(this.currX, this.currY, this.drawWidth/2, 0, 2*Math.PI)
    this.ctx.fill();
    this.ctx.closePath();
}

function doConfirm(msg, yesFn, noFn)
{
    let confirmBox = $("#confirmBox");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(() =>
    {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show();
}

function doLabels()
{
    let labelBox = $("#labelBox");
    labelBox.find(".message").text("What is the right answer?");
    labelBox.find(".b0,.b1,.b2,.b3,.b4,.b5,.b6,.b7,.b8,.b9").unbind().click(() =>
    {
        labelBox.hide();
    });
    $("#b0").click( () => { console.log('0'); uploadLabel(0); });
    $("#b1").click( () => { uploadLabel(1); });
    $("#b2").click( () => { uploadLabel(2); });
    $("#b3").click( () => { uploadLabel(3); });
    $("#b4").click( () => { uploadLabel(4); });
    $("#b5").click( () => { uploadLabel(5); });
    $("#b6").click( () => { uploadLabel(6); });
    $("#b7").click( () => { uploadLabel(7); });
    $("#b8").click( () => { uploadLabel(8); });
    $("#b9").click( () => { uploadLabel(9); });
    labelBox.show();
}

function uploadLabel(label) 
{
    var labelData = new FormData();
    labelData.append('imagelabel', label);
    var labelRequest = new XMLHttpRequest();
    labelRequest.open("POST", "/uploadlabel", true);
    console.log(label);
    labelRequest.onload = function() 
    {
        window.location = '/thankyou';
    }
    labelRequest.send(labelData);
}

function submitImg(input) 
{
    let formData = new FormData();
    if (input == 'canvas')
    {
        var inputElement = this.dataURItoBlob(this.canvas.toDataURL("image/png"));
        formData.append('imageSub',inputElement);
    } 
    else
    {
        let file = document.querySelector("input[type='file']")
        var inputElement = file.files[0];
        formData.append('fileSub',inputElement);
    }
    let request = new XMLHttpRequest();
    
    request.onload = function() 
    {      //Respond to async call back
        if (this.status == 200) 
        {
            let answer = request.response.prediction;
            doConfirm("The Answer is "+answer+", right?",
                function() 
                {
                    window.location = '/thankyou';
                },
                function() 
                {
                    doLabels();
                });
        }
        };

    request.responseType = 'json';
    request.open("POST", "/uploadimage", true);
    console.log(formData);
    request.send(formData);
}

function dataURItoBlob(dataURI) {   // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]  // separate out the mime component
    var ab = new ArrayBuffer(byteString.length);    // write the bytes of the string to an ArrayBuffer
    var ia = new Uint8Array(ab);    // create a view into the buffer
    for (var i = 0; i < byteString.length; i++) // set the bytes of the buffer to the correct values
    {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab], {type: mimeString});  // write the ArrayBuffer to a blob, and you're done
    return blob;
}


$(() => {
    constructor();
    $('#clear').click(() => {
        init();
    });
    $('#submitCanvas').click(() => {
        submitImg('canvas');
    });
    $('#submitFile').click(() => {
        submitImg('file');
    });
});