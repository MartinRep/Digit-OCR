class Main
{
    constructor()
    {
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
    
    onMouseDown(e)
    {
        this.currX = e.clientX - this.canvas.offsetLeft;  //Sets start position for drawing
        this.currY = e.clientY - this.canvas.offsetTop;
        this.flag = true;
    }
    
    onMouseMove(e)
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

    onMouseUpOrOut()
    {
        this.flag = false;
    }

    init() 
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() 
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

    submitImg() 
    {
        var dataURL = this.canvas.toDataURL("image/png");
        var blob = this.dataURItoBlob(dataURL);
        var formData = new FormData();
        formData.append('imageSub',blob);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //deal with response, errors.
        }
        request.open("POST", "/uploadimage", true);
        request.send(formData);
    }

    dataURItoBlob(dataURI) {   // convert base64 to raw binary data held in a string
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
}

$(() => {
    var main = new Main();
    $('#clear').click(() => {
        main.init();
    });
    $('#submit').click(() => {
        main.submitImg();
    });
});