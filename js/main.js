var camera, scene, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();

init();
animate();

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function createSphere(x,y,z) {
    var sgeometry = new THREE.SphereGeometry( 5, 32, 32 );
    var smaterial = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( sgeometry, smaterial );
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    return sphere;
}

function init() {
    
    function cameraLookDir(camera) {
        var vector = new THREE.Vector3(0, 10, -1);
        vector.applyEuler(camera.rotation, camera.eulerOrder);
        return vector;
    }
    
    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);
    
    effect = new THREE.StereoEffect(renderer);
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    camera.position.set(0, 200, 0);
    scene.add(camera);
    
    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(-Math.PI / 4);
    controls.target.set(
        // camera.position.x + 0.1,
        // camera.position.y,
        // camera.position.z
	100,0,0
    );
    controls.noZoom = true;
    controls.noPan = true;
    
    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }
	
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
	
        element.addEventListener('click', fullscreen, false);
	
        window.removeEventListener('deviceorientation', setOrientationControls);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);
    
    
    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(light);
    
    var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();
    
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
    });
    
    var geometry = new THREE.PlaneGeometry(1000, 1000);
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    //    scene.add(mesh);
    
    cameraLookDir(camera);    
    
    
    
    for (var i = 0; i < 300; i++) {
    	scene.add(
    	    createSphere(
    		randomIntFromInterval(100, 1000),
		//  		randomIntFromInterval(10, 70),
		randomIntFromInterval(-700, 700),
    		randomIntFromInterval(-900, 900)
    	    ));
    }
    
    
    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    
    
    
    
    
    resize();
    
    camera.updateProjectionMatrix();
    
    controls.update(dt);
}

function render(dt) {
    effect.render(scene, camera);
}

function animate(t) {
    
    
    requestAnimationFrame(animate);
    camera.position.x+=1.1;
    controls.target.x+=1.1;
    //console.log(camera.position.x);
    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}
