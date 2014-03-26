var camera, scene, renderer;
var controls;
var camTarg = null;
var followLatest = true;
var congaOn;

var objects = [];
var objA = [];
var current = null;
var prev;
var nxt = null;
var resetCam = false;
var spliceOffset = 0;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;

	scene = new THREE.Scene();

	projector = new THREE.Projector();

  // background image
  var birdEl = document.createElement('div');
  birdEl.className = 'bird';

	var object = new THREE.CSS3DObject( birdEl );
	object.position.x = 0;
	object.position.y = 0;
	object.position.z = 0;
	twerk(object);
	scene.add( object );

	function twerk(bird){
		var frequency = 1500;
		var up = true;
		window.setInterval(function(){
			var moveTo = {};
			if(Math.random() >= .5){
				if(up){
					moveTo.x = bird.position.x + 30;
					moveTo.y = bird.position.y + 30;
				} else {
					moveTo.x = bird.position.x - 30;
					moveTo.y = bird.position.y - 30;
				}
				new TWEEN.Tween( bird.position )
					.to( { x: moveTo.x, y: moveTo.y }, 200 )
					.easing( TWEEN.Easing.Exponential.InOut )
					.start();
				render();
				up = !up;
			}
		}, frequency);
	}

	//

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	//

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener( 'change', render );

	
	var button = document.getElementById( 'latest' );
	button.addEventListener( 'click', function ( event ) {

		followLatest = true;
		current = null;
		next = null;

	}, false );

	var button = document.getElementById( 'back' );
	button.addEventListener( 'click', function ( event ) {

		followLatest = false;
		var length = objA.length;
		if(current === null){
			console.log('current was null');

			current = objA[objA.length-1];
		}
		if(current.prevO){

			current = current.prevO
			console.log('current', current);
			camTarg = current.position;
			var prevCamPos = camera.position;

			new TWEEN.Tween( prevCamPos )
	                .to( { x: current.position.x, y: current.position.y, z: current.position.z + 600}, Math.random() * 1000 + 1000 )
	                .easing( TWEEN.Easing.Exponential.InOut )
	                .start();
		}

	}, false );

	var button = document.getElementById( 'forward' );
	button.addEventListener( 'click', function ( event ) {

		followLatest = false;
		var length = objA.length;
		if(current === null){
			console.log('current was null');
			current = objA[objA.length - 1];
		}
		if(current.nextO){
			current = current.nextO;
			console.log('current', current);
			camTarg = current.position;
			var prevCamPos = camera.position;

			new TWEEN.Tween( prevCamPos )
	                .to( { x: current.position.x, y: current.position.y, z: current.position.z + 600}, Math.random() * 1000 + 1000 )
	                .easing( TWEEN.Easing.Exponential.InOut )
	                .start();
		}

		spliceOffset = 0;

	}, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function runConga(){
	followLatest = true;
	current = null;
	next = null;
	congaOn = true;

	for(var i=0, len=objA.length; i<len; i++){
		var interval = 1000;
		var target = {};
		target.x = 0;
		target.y = 0;
		target.z = i * 610 + 610;
		var obj = objA[i];
		var count = 0;

		//window.setInterval(function(){
			new TWEEN.Tween( obj.position )
				.to( { x: target.x, y: target.y, z: target.z }, 200 )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
			count++;
			render();
		//}, interval);

	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {

	if(camTarg != null) {
		camera.lookAt(camTarg);
	}
	if(resetCam){
		camera.rotation.set(0,0,0);
		resetCam = false;
	}
	renderer.render( scene, camera );

}

function onDocumentMouseDown( event ) {
	resetCam = true;
	event.preventDefault();
	followLatest = false;
	var prevCamPos = camera.position;
        
  camTarg = this.threeObj.position;

  new TWEEN.Tween( prevCamPos )
      .to( { x: this.threeObj.position.x, y: this.threeObj.position.y, z: this.threeObj.position.z + 600}, Math.random() * 1000 + 1000 )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();
}