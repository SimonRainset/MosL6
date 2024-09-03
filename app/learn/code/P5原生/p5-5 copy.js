let x,y,d;
function setup()
{
    createCanvas(600,400);
    x = 300;
    y = 200;
    d = 50;

}

function draw()
{
    clear();
    background(220);
    fill(200,0,0);
    circle(x,y,d);
    
    text(''+dist(mouseX,mouseY,x,y),20,20);
    if(mouseIsPressed === true) 
    {
        if (mouseInsideCircle()) d++;
        else
        {
            x -= (x-mouseX)>0?1:-1;
            y -= (y-mouseY)>0?1:-1;
        }
    }

}

function mouseInsideCircle()
{
    if (dist(mouseX,mouseY,x,y) < d/2) return true;   // dist calcautes distance between two points
    else return false;
}