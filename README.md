# jQuery-radar-graph
Create a customizable radar graph with minimal code. 

Step 1:
  Link the radarGraph.js file:
    <script type="text/javascript" src="FILEPATH/TO/radarGraph.js"></script>
  
  Link to a separate js file: (Optional)
    <script type="text/javascript" src="FILEPATH/TO/ANOTHER/JSFILE.js"></script>
  
  Or add script tags:
    <script></script>
  
Step 2:
  create a canvas element with an ID in an html file:
    <canvas id="canvas1">This text would show if browser does not support canvas.</canvas>
  
Step 3:
  Inside your custom js file or inside the script tags add the following at a minimun to test:
  
    $(document).ready(function (){
    $('#canvas1').graphMod();
    });
