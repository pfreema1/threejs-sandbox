/**
 * @author wongbryan / http://wongbryan.github.io
 *
 * Pixelation shader
 */



var PixelShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"resolution": { value: null },
		"pixelSize": { value: 1. },
		"direction": { value: null },
		"u_mouse": { value: null }

	},

	vertexShader: [

		"varying highp vec2 vUv;",

		"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform float pixelSize;
		uniform vec2 resolution;
		uniform vec2 direction;
		uniform vec2 u_mouse;

		varying highp vec2 vUv;

		float random (vec2 st) {
			return fract(sin(dot(st.xy,
							vec2(12.9898,78.233))) * 43758.5453123);
		}

		vec2 random2(vec2 st){
			st = vec2( dot(st,vec2(127.1,311.7)),
					  dot(st,vec2(269.5,183.3)) );
			return -1.0 + 2.0*fract(sin(st)*43758.5453123);
		}
		
		float noise(vec2 st) {
			vec2 i = floor(st);
			vec2 f = fract(st);
		
			vec2 u = f*f*(3.0-2.0*f);
		
			return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
							 dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
						mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
							 dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
		}

		void main() {
			float rnd = random(vUv);
			float whiteThresh = 0.6;
			float steppedRnd = step(whiteThresh, rnd);

			float n = noise(vUv * 100.0 * u_mouse.x);
			vec4 textureColor = texture2D(tDiffuse, vUv);
			vec4 snowColor = vec4(rnd);

			vec4 mixedColor = mix(textureColor, snowColor, n);

			// float dist = distance(vUv, vec2(0.5));
			// // float steppedDist = step(0.3, dist);
			// float radius = u_mouse.x;
			// float smoothStepDist = smoothstep(radius - 0.2, radius + 0.2, dist);

			// vec4 textureColor = texture2D(tDiffuse, vUv);
			// vec4 mixedColor = mix(textureColor, vec4(rnd), steppedRnd * smoothStepDist);

			gl_FragColor = mixedColor;
			
		}`
};

/*
//this will be our RGBA sum
	vec4 sum = vec4(0.0);
	
	//our original texcoord for this fragment
	vec2 tc = vTexCoord;
	
	//the amount to blur, i.e. how far off center to sample from 
	//1.0 -> blur by one pixel
	//2.0 -> blur by two pixels, etc.
	float blur = radius/resolution; 
    
	//the direction of our blur
	//(1.0, 0.0) -> x-axis blur
	//(0.0, 1.0) -> y-axis blur
	float hstep = dir.x;
	float vstep = dir.y;
    
	//apply blurring, using a 9-tap filter with predefined gaussian weights
    
	sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;
	sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;
	sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;
	sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;
	
	sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;
	
	sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;
	sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;
	sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;
	sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;

	//discard alpha for our simple demo, multiply by vertex color and return
	gl_FragColor = vColor * vec4(sum.rgb, 1.0);
*/

export { PixelShader };
