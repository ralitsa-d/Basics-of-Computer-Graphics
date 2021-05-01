var framed = false;
var walls, frame;

// функция за създаване на сцената
function createScene()
{
	// нагласяване на цвета и центрирането на текста с имената ви
	document.getElementsByTagName('h1')[0].style = 'color:white; text-align:center;';

	// създаване на рисувателното поле на цял екран
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0; z-index:-1;';

	// създаване на сцена и камера
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );

	document.body.addEventListener('click',enframe);
	document.body.addEventListener('keypress',enframe);
	document.body.addEventListener('contextmenu',function(e){ e.preventDefault(); enframe(); return false});
	window.addEventListener( 'resize', onWindowResize, false );
	
	function onWindowResize()
	{
		camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	// създаване на земята като плоска равнина
	var ground = new THREE.Mesh(
		new THREE.PlaneGeometry(13000,13000),
		new THREE.MeshPhongMaterial({color:'goldenrod'})
	);
	ground.position.set(0,-11,0);
	ground.rotation.set(-Math.PI/2,0,0);
	scene.add( ground );

	// прозрачни стени
	walls = new THREE.Mesh(
		new THREE.BoxGeometry(41,21,11),
		new THREE.MeshPhongMaterial({color:'white',shininess:220,opacity:0.45,transparent:true,side:THREE.DoubleSide})
	);
	walls.visible = framed;
	scene.add(walls);

	// тънък бял кант
	frame = new THREE.BoxHelper(walls);
	frame.material.color.set('white');
	frame.visible = framed;
	scene.add( frame );

	// създаване на четири светлини с различни цветове
	lights=[];
	var colors=['dodgerblue','hotpink','cyan','fuchsia'];
	for (var i=0; i<4; i++)
	{
		lights[i] = new THREE.PointLight(colors[i],1);
		scene.add(lights[i]);
	}
	
	// активиране на анимацията
	drawFrame();
}

function enframe()
{
	framed = !framed;
	walls.visible = framed;
	frame.visible = framed;
}

// функция за анимиране на сцената
function drawFrame()
{
	requestAnimationFrame( drawFrame );
	
	var t = (new Date()).getTime()/1000; // време в секунди
	
	// леко въртене на сцената
	scene.rotation.x = Math.sin(t)/9;
	scene.rotation.y = Math.sin(t/2);
	scene.rotation.z = Math.cos(t)/9;

	// приближаване и отдалечаване на камерата
	camera.position.set(0,3,70+10*Math.sin(1.25*t));

	// движение на светлините
	for (var i=0; i<4; i++)
	{
		var angle = t+Math.PI/2*i;
		lights[i].position.set(
			25*Math.cos(angle),
			10*Math.sin(1.5*angle)+5,
			15+5*Math.cos(2*angle));
	}
	
	//рисуване на сцената
	renderer.render( scene, camera );
}		

var word = new THREE.Group();

function main()
{
	createScene();

	scene.add(word);
}