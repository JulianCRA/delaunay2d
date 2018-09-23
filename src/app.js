import p5 from '../node_modules/p5/lib/p5.min.js';
import Delaunator from 'delaunator';

const _WIDTH = 800;
const _HEIGHT = 800;

let p5instance;
let img64;


const sketch = (p) => {
	let img, temp;
	
	p.preload = () => {
		temp = p.loadImage(img64);
	}

	p.setup = () =>{
		temp.filter(p.GRAY);
		p.createCanvas(_WIDTH, _HEIGHT);
		p.background(0);
		p.image(temp, 0, 0, _WIDTH, _HEIGHT);
		p.noFill();
		p.stroke('white');
		
		img = p.createGraphics(_WIDTH, _HEIGHT);
		img.image(temp, 0, 0, _WIDTH, _HEIGHT);
		
	}

	p.toPoster = (colors) => {
		img.image(temp, 0, 0, _WIDTH, _HEIGHT);
		if(colors >= 2){
			img.filter(p.POSTERIZE, colors);
		}
		p.toDelaunay();
	}

	function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }

	p.toDelaunay = () => {
		let max = 0.02;
		img.loadPixels();
		console.log(img.pixels);
		let points = [];
		let yy, xx;
		for(let i = 0; i < img.pixels.length; i+=4){
			xx = Math.floor((i/4) % _WIDTH);
			yy = ((i/4) - xx) / _WIDTH;
			if(	(img.pixels[i] === 255 && Math.random() < max) || 
				(img.pixels[i] === 170 && Math.random() < max/2) ||
				(img.pixels[i] === 85 && Math.random() < max/3) ||
				(img.pixels[i] === 0 && Math.random() < max/4)	){
				points.push( [xx, yy] );
			}
		}
		
		console.log(points);
		let delaunay = Delaunator.from(points);
		
		p.background(0);
		
		for (let e = 0; e < delaunay.triangles.length; e++) {
			if (e > delaunay.halfedges[e]) {
				const pp = points[delaunay.triangles[e]];
				const qq = points[delaunay.triangles[nextHalfedge(e)]];
				p.line(pp[0], pp[1], qq[0], qq[1]);
			}
		}
	}

}

function handleFileSelect(evt) {
	let file = evt.target.files[0];
	let reader;

	if (file.type.match("image.*")) {
		reader = new FileReader();
		reader.onload = (e) => {
			img64 = e.target.result; 
			if(p5instance)	p5instance.remove();
			p5instance = new p5(sketch, 'sk');
			window.p5instance = p5instance;
		};
	}

	reader.readAsDataURL(file);
}

document.getElementById("file").addEventListener("change", handleFileSelect, false);

document.getElementById("postercolors").addEventListener("input", posterize, false);

function posterize(){
	p5instance.toPoster(this.value);
}
