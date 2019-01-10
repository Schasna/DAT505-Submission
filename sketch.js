
if ( WEBGL.isWebGLAvailable() === false ) {

  document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container, stats, controls;
var camera, scene, renderer, light;
var chicken ;
var chickenGroup;

var keyPressed;
var clock = new THREE.Clock();

var mixers = [];

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 100, 200, 300 );

  controls = new THREE.OrbitControls( camera );
  controls.target.set( 0, 100, 0 );
  controls.update();

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xa3d5d3);//网格背景的颜色，不要忘记css的背景颜色也要统一。
  scene.fog = new THREE.Fog( 0xa3d5d3, 200, 1000 );//在这里改变网格的颜色

  light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  light.position.set( 0, 200, 0 );
  scene.add( light );

  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 200, 100 );
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = - 100;
  light.shadow.camera.left = - 120;
  light.shadow.camera.right = 120;
  scene.add( light );

  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

  // ground
  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add( grid );

  // model
  chickenGroup = new THREE.Group();
  scene.add(chickenGroup);
  var loader = new THREE.FBXLoader();
  loader.load( 'models-chicken/animationjs.fbx', function ( object ) {

    object.mixer = new THREE.AnimationMixer( object );
    mixers.push( object.mixer );

    var action = object.mixer.clipAction( object.animations[ 0 ] );
    //action.play();

    object.traverse( function ( child ) {

      if ( child.isMesh ) {
// mesh.scale.set( 20, 10, 10 );
        child.castShadow = true;
        child.receiveShadow = true;

      }

    } );
    chicken = object;

    chickenGroup.add( object );
    action.play();
    // object.scale.set(20,20,20);\
  } );


  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  //renderer.setClearColor(0xeeeeee);
  renderer.setClearColor('#428bca',1.0)

  renderer.shadowMap.enabled = true;
  container.appendChild( renderer.domElement );
  renderer.setClearColor(0xff0000)

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener('keydown', startAnimation);
  window.addEventListener('keyup', stopAnimation);

  // stats
  stats = new Stats();
  container.appendChild( stats.dom );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function stopAnimation(event) {
  var action = chicken.mixer.clipAction( chicken.animations[ 0 ] );
  action.stop();
}

function startAnimation(event) {
  keyPressed = event.key;
  console.log({ keyPressed })
  if (keyPressed == 'w') {
    chickenGroup.translateZ(10);
  } else if (keyPressed == 's') {
    // chickenGroup.position.z += -.5;
    chickenGroup.translateZ(-1);
  }
  // var meshToRotate = new THREE.Mesh( geometry, material );
  //
  //       //Rotating mesh by 90 degree in X axis.
  //       chickenGroup.rotateX( Math.PI / 2 );
  if (keyPressed =='a'){
    // chickenGroup.position.x += .5;
    chickenGroup.rotation.y += .3;
  
  }else if(keyPressed =='d'){
    // chickenGroup.position.x += -.5;
    chickenGroup.rotation.y += -.3;
  }

  // console.log('key down event', event)
  var action = chicken.mixer.clipAction( chicken.animations[ 0 ] );
  action.play();
}

//

function animate() {
  requestAnimationFrame( animate );
  // chicken.scale.set(10, 10, 10)
  if ( mixers.length > 0 ) {
    for ( var i = 0; i < mixers.length; i ++ ) {
      mixers[ i ].update( clock.getDelta() );
    }
  }

  keyPressed = undefined;
  renderer.render( scene, camera );
  stats.update();
}
