// Get the canvas element and create the Babylon.js engine.
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
// Create the scene.
const createScene = function () {
 const scene = new BABYLON.Scene(engine);
 // Create a basic camera and position it.
 const camera = new BABYLON.ArcRotateCamera(
   "Camera", -Math.PI / 2, Math.PI / 3, 30, new BABYLON.Vector3(0, 0, 0), scene
 );
 camera.attachControl(canvas, true);
 // Create a hemispheric light.
 const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
 // Create a ground.
 const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
 ground.position.y = -1;
 // Create two fighters as boxes.
 const fighter1 = BABYLON.MeshBuilder.CreateBox("fighter1", { size: 2 }, scene);
 fighter1.position = new BABYLON.Vector3(-5, 0, 0);
 fighter1.material = new BABYLON.StandardMaterial("mat1", scene);
 fighter1.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue
 const fighter2 = BABYLON.MeshBuilder.CreateBox("fighter2", { size: 2 }, scene);
 fighter2.position = new BABYLON.Vector3(5, 0, 0);
 fighter2.material = new BABYLON.StandardMaterial("mat2", scene);
 fighter2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red
 // Set up movement for fighter1 using WASD keys.
 const inputMap = {};
 scene.actionManager = new BABYLON.ActionManager(scene);
 scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt) {
   inputMap[evt.sourceEvent.key.toLowerCase()] = true;
 }));
 scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt) {
   inputMap[evt.sourceEvent.key.toLowerCase()] = false;
 }));
 // Movement speed variable.
 const speed = 0.2;
 // Game loop: update fighter1's position based on input.
 scene.onBeforeRenderObservable.add(() => {
   if (inputMap["w"]) {
     fighter1.position.z += speed;
   }
   if (inputMap["s"]) {
     fighter1.position.z -= speed;
   }
   if (inputMap["a"]) {
     fighter1.position.x -= speed;
   }
   if (inputMap["d"]) {
     fighter1.position.x += speed;
   }
   // Attack with spacebar: change fighter1's color briefly.
   if (inputMap[" "]) {
     fighter1.material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow to indicate attack
   } else {
     fighter1.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Default blue
   }
   // Basic collision check between fighters.
   const distance = BABYLON.Vector3.Distance(fighter1.position, fighter2.position);
   if (distance < 2.5) {
     fighter2.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Turn green on contact
   } else {
     fighter2.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Otherwise, red
   }
 });
 return scene;
};
const scene = createScene();
// Start the render loop.
engine.runRenderLoop(() => {
 scene.render();
});
// Resize the engine on window resize.
window.addEventListener("resize", () => {
 engine.resize();
});