let colors = {
  'green': 0x3BDAA5,
  'tan': 0xF4E3CF,
  'lightyellow': 0xFFEEAB,
  'brownish': 0xE16641,
  'skyblue': 0xA4D1E9,
  'red': 0xFC3F30,
  'pink': 0xFCC8C8,
  'purple': 0xD2B7FF,
  'yellow': 0xFFEC5F,
  'blue': 0x0091E2,
  'white': 0xffffff,
  'black': 0x000000,
  'gray': 0xCFD1D2
};

// let windows = [];


function PageWindow(id, parentId) {
  jQuery('<div/>', {
    id: id,
    class: 'concept'
  }).appendTo('#windows');

  let num = id.split('-')[1];
  let url = '/concept/' + num;

  console.log(id);
  $.get(url, function(data){
      let idString = '#' + id;
      $(idString).append(data);

      $(idString).find('#window-close').click(function(e){
        $(idString).children('div:first').detach();
        // let intoTheVoid = $(windows[0].id).children('div:first').detach();
      });

      let baseUrl = 'http://api.are.na/v2/channels/';
      let channel;
      switch(num){
        case '01':
          channel = 'findings-in-rhythm';
          break;
        case '02':
          channel = 'concept-bits-and-bobs';
          break;
        default:
          break;
      }

      $.get(baseUrl + channel, function( data ) {
          let contents = data.contents;
          for(let i = 0; i < contents.length; i++){
            let html = createHtmlFromBlock(contents[i]);

            $('<div/>', {
              class: 'arena_block',
              html: html
            }).appendTo('#arena-01');
          }
      });
  });

  this.id = id;
}

function createHtmlFromBlock(block){
  let html = '';

  switch(block.class){
    case 'Text':
      html += block.content_html;
      break;
    case 'Channel':
      html += '<p>';
      html += block.title;
      html += '<br><br>';
      html += "<i>go to channel</i> <span style='font-size: 1.2rem;'> ⤳</span>";
      html += '</p>';
      break;
    case 'Image':
      html += '<img src="' + block.image.display.url + '"/>';
      break;
    default:
      break;
  }

  return html;
}

function Canvas(width, height, id){

      // custom global variables
    var raycaster, mouse = {
        x: 0,
        y: 0
      },
      INTERSECTED = null;

    var scene = new THREE.Scene();
  	var camera = new THREE.PerspectiveCamera(75, width/height, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 300;
    camera.position.x = -500;

    this.camera = camera;
    this.cameraX = -600;
    this.cameraY = 600;
    this.cameraZ = 600;


  	var renderer = new THREE.WebGLRenderer({ alpha: true });
  	renderer.setSize(width, height);
    // renderer.antialias = true;
  	document.getElementById(id).appendChild(renderer.domElement);


    let that = this;
  	function render() {
  		requestAnimationFrame(render);

      camera.position.x = that.cameraX;
      camera.position.y = that.cameraY;
      camera.position.z = that.cameraZ;
      camera.lookAt(0, 0, 0);

      // object.updatePosition(cubeX, cubeY, cubeZ);

      // cube.position.x = that.cubeX;
      // cube.position.y = that.cubeY;
      // cube.position.z = that.cubeZ;

      for(let i = 0; i < fieldArr.length; i++){
        fieldArr[i].move();
      }

  		renderer.render(scene, camera);
      update();
  	};


    // create a grid
    var gridSize = 700;
    var gridDivisions = 15;

    var gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0xff0000, 0xff0000);
    gridHelper.position.y = -100;
		gridHelper.position.x = 0;
    // gridHelper.geometry.rotateX( Math.PI / 10 );
    gridHelper.name = 'field';
    scene.add( gridHelper );

    var averageObjectSize = 100;
    this.cubeFieldLimit = (gridSize / 2) - (averageObjectSize / 2);

    this.saveCubeState = function(){
      console.log(this.cubeX, this.cubeY, this.cubeZ);
    }

    // for mouse intersections
    raycaster = new THREE.Raycaster;

    // when the mouse moves, call the given function
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);

    window.addEventListener('resize', onWindowResize, false);
    let fieldEl = $('#field-01');


    let fieldObjects = {};
    let fieldArr = [];

    function onWindowResize(){
      // camera.aspect = window.innerWidth / window.innerHeight;
      camera.aspect = fieldEl.width() / fieldEl.height();
      camera.updateProjectionMatrix();

      renderer.setSize( fieldEl.width(), fieldEl.height() );
    }

    function onDocumentMouseMove(event) {
      // the following line would stop any other event handler from firing
      // (such as the mouse's TrackballControls)
      // event.preventDefault();

      // update the mouse variable
      mouse.x = (event.clientX / fieldEl.width()) * 2 - 1;
      mouse.y = -(event.clientY / fieldEl.height()) * 2 + 1;
    }

    function onDocumentMouseDown(event) {
      if(INTERSECTED) {
        fieldObjects[INTERSECTED.name].mouseDown();
      }
    }

    function onDocumentMouseUp(event) {
      if(INTERSECTED) {
        // INTERSECTED.mouseUp();
        fieldObjects[INTERSECTED.name].mouseUp();
      }
    }

    function update() {
      // find intersections

      // create a Ray with origin at the mouse position
      //   and direction into the scene (camera direction)
      // var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
      // vector.unproject(camera);
      // var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

      raycaster.setFromCamera(mouse, camera);

      // create an array containing all objects in the scene with which the ray intersects
      var intersects = raycaster.intersectObjects(scene.children);

      // INTERSECTED = the object in the scene currently closest to the camera
      //		and intersected by the Ray projected from the mouse position

      // if there is one (or more) intersections
      if (intersects.length > 0) {
        // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object != INTERSECTED && intersects[0].object.name != 'field') {
          // restore previous intersection object (if it exists) to its original color
          if (INTERSECTED){
            // INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            fieldObjects[INTERSECTED.name].mouseOut();
          }
          // store reference to closest object as current intersection object
          INTERSECTED = intersects[0].object;
          // store color of closest object (for later restoration)
          fieldObjects[INTERSECTED.name].mouseIn();
        }
      } else // there are no intersections
      {
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED){
          fieldObjects[INTERSECTED.name].mouseOut();
        }
          // remove previous intersection object reference
          //     by setting current intersection object to "nothing"
          INTERSECTED = null;
      }
    }

    function ConceptObject(x, y, z, size, name){
      var geometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
      // var geometry = new THREE.OctahedronGeometry(size, 1);

    	var material = new THREE.MeshBasicMaterial({color: colors.white});
    	var cube = new THREE.Mesh(geometry, material);
      cube.position.y = y;

      this.cubeX = x;
      this.cubeY = y;
      this.cubeZ = z;

      this.offsetSpeed = 0.008;
      this.offset = 0;


      // upper and lower limit = (width / 2) - (objectWidth / 2)

      var geo = new THREE.EdgesGeometry( cube.geometry );
      var mat = new THREE.LineBasicMaterial( { color: colors.black, linewidth: 10} );
      var wireframe = new THREE.LineSegments( geo, mat );
      wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
      cube.add( wireframe );
      cube.name = name;

      var outlineMaterial = new THREE.MeshBasicMaterial( { color: colors.green, side: THREE.BackSide } );
      outlineMaterial.transparent = true;
      outlineMaterial.opacity = 0.3;
    	var outlineMesh = new THREE.Mesh( cube.geometry, outlineMaterial );
      outlineMesh.position.x = x;
      outlineMesh.position.y = y;
      outlineMesh.position.z = z;

      let outlineScaleFactor = 0.20;
    	outlineMesh.scale.multiplyScalar(1 + outlineScaleFactor);
      outlineMesh.material.visible = false;
      outlineMesh.name = name;
    	scene.add( outlineMesh );

      this.mouseIn = function(){

        // cube.currentHex = cube.material.color.getHex();

        outlineMesh.material.visible = true;
        // set a new color for closest object
        cube.material.color.setHex(0xffffff);
        $('#field-01').addClass('object--is-hovered');
      }

      this.mouseDown = function(){
        let scaleDownFactor = -0.15;
        let cubeScale = 1 + scaleDownFactor;
        let outlineScale = cubeScale + outlineScaleFactor;
        cube.scale.set(cubeScale, cubeScale, cubeScale);
        outlineMesh.scale.set(outlineScale, outlineScale, outlineScale);
      }

      this.mouseOut = function(){
        cube.material.color.setHex(0xffffff);
        outlineMesh.material.visible = false;
        $('#field-01').removeClass('object--is-hovered');
      }

      this.mouseUp = function(){
        cube.scale.set(1, 1, 1);
        let outlineScale = 1 + outlineScaleFactor;
        outlineMesh.scale.set(outlineScale, outlineScale, outlineScale);
        this.showWindow();
      }

      this.showWindow = function(){
        let id = cube.name;
        let page = new PageWindow(id, 'body');
      }

      this.updatePosition = function(x, y, z){
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
      }

      this.move = function(){
        // this.offset += this.offsetSpeed;
        outlineMesh.rotation.x = cube.rotation.x += this.offsetSpeed;
        outlineMesh.rotation.y = cube.rotation.y += this.offsetSpeed;
        outlineMesh.rotation.z = cube.rotation.z += this.offsetSpeed;

        outlineMesh.position.x = cube.position.x = this.cubeX;
        outlineMesh.position.y = cube.position.y = this.cubeY;
        outlineMesh.position.z = cube.position.z = this.cubeZ;
      }

      this.mesh = cube;
    }



    this.object = createObject(0, 75, 0, 100, 'concept-01');
    this.object2 = createObject(-175, 175, 25, 100, 'concept-02');

    function createObject(x, y, z, size, name){
      var object = new ConceptObject(x, y, z, size, name);
      scene.add(object.mesh);
      fieldObjects[object.mesh.name] = object;
      fieldArr.push(object);

      return object;
    }

    render();
    onWindowResize();

}

$(function(){
  let canvas = new Canvas(500, 500, 'field-01');

  // create dat GUI
  const gui = new dat.GUI();

  gui.add(canvas, 'cameraX', -2000, 2000);
  gui.add(canvas, 'cameraY', -2000, 2000);
  gui.add(canvas, 'cameraZ', -2000, 2000);

  gui.add(canvas.object, 'cubeX', -canvas.cubeFieldLimit, canvas.cubeFieldLimit);
  gui.add(canvas.object, 'cubeY', 0, 200);
  gui.add(canvas.object, 'cubeZ', -canvas.cubeFieldLimit, canvas.cubeFieldLimit);


  $('#save-cube-state').click(function(e){
    canvas.saveCubeState();
  });
});
