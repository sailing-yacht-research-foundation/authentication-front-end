import '../styles/video-section.css';

import React, { useRef, useState } from "react";
import { Plane, useCurtains } from "react-curtains";
import { Vec2 } from 'curtainsjs/dist/curtains.umd';
import Video from './assets/sailing.webm';

const vertexShader = `
  precision mediump float;
  // default mandatory variables
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  // our texture matrix uniform
  uniform mat4 simplePlaneTextureMatrix;
  // custom variables
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMousePosition;
  uniform float uMouseMoveStrength;
  void main() {
    vec3 vertexPosition = aVertexPosition;
    // get the distance between our vertex and the mouse position
    float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));
    // calculate our wave effect
    float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));
    // attenuate the effect based on mouse distance
    float distanceStrength = (0.4 / (distanceFromMouse + 0.4));
    // calculate our distortion effect
    float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;
    // apply it to our vertex position
    vertexPosition.z +=  distortionEffect / 30.0;
    vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
    vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);
    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
    // varyings
    vTextureCoord = (simplePlaneTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vVertexPosition = vertexPosition;
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;
  uniform sampler2D simplePlaneTexture;
  void main() {
    // apply our texture
    vec4 finalColor = texture2D(simplePlaneTexture, vTextureCoord);
    // fake shadows based on vertex position along Z axis
    finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
    // fake lights based on vertex position along Z axis
    finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);
    // handling premultiplied alpha (useful if we were using a png with transparency)
    finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
    gl_FragColor = finalColor;
  }
`;

export function SimpleVideoPlane() {
  const [plane, setPlane] = useState<any>(null);

  const mousePosition = useRef(new Vec2());
  const mouseLastPosition = useRef(new Vec2());

  const deltas = useRef({
    max: 0,
    applied: 0
  });

  const uniforms = {
    resolution: {
      // resolution of our plane
      name: "uResolution",
      type: "2f", // notice this is an length 2 array of floats
      value: [0, 0]
    },
    time: {
      // time uniform that will be updated at each draw call
      name: "uTime",
      type: "1f",
      value: 0
    },
    mousePosition: {
      // our mouse position
      name: "uMousePosition",
      type: "2f", // again an array of floats
      value: mousePosition.current
    },
    mouseMoveStrength: {
      // the mouse move strength
      name: "uMouseMoveStrength",
      type: "1f",
      value: 0
    }
  };

  useCurtains(
    (curtains) => {
      const onMouseMove = (e) => {
        // update mouse last pos
        mouseLastPosition.current.copy(mousePosition.current);

        const mouse = new Vec2();

        // get our mouse/touch position
        if (e.targetTouches) {
          mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        } else {
          mouse.set(e.clientX, e.clientY);
        }

        // lerp the mouse position a bit to smoothen the overall effect
        mousePosition.current.set(
          curtains.lerp(mousePosition.current.x, mouse.x, 0.3),
          curtains.lerp(mousePosition.current.y, mouse.y, 0.3)
        );

        // calculate the mouse move strength
        if (mouseLastPosition.current.x && mouseLastPosition.current.y) {
          let delta =
            Math.sqrt(
              Math.pow(
                mousePosition.current.x - mouseLastPosition.current.x,
                2
              ) +
                Math.pow(
                  mousePosition.current.y - mouseLastPosition.current.y,
                  2
                )
            ) / 30;
          delta = Math.min(4, delta);
          // update max delta only if it increased
          if (delta >= deltas.current.max) {
            deltas.current.max = delta;
          }
        }

        if (plane) {
          // update our mouse position uniform
          plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(
            mousePosition.current
          );
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onMouseMove, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onMouseMove, { passive: true } as EventListenerOptions);
      };
    },
    [plane]
  );

  const setResolution = (plane) => {
    const planeBBox = plane.getBoundingRect();
    plane.uniforms.resolution.value = [planeBBox.width, planeBBox.height];
  };

  const onReady = (plane) => {
    plane.setPerspective(35);

    deltas.current.max = 2;

    setResolution(plane);

    // dont bother with user gesture
    plane.playVideos();

    setPlane(plane);
  };

  const onRender = (plane) => {
    // increment our time uniform
    plane.uniforms.time.value++;

    // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
    deltas.current.applied +=
      (deltas.current.max - deltas.current.applied) * 0.02;
    deltas.current.max += (0 - deltas.current.max) * 0.01;

    // send the new mouse move strength value
    plane.uniforms.mouseMoveStrength.value = deltas.current.applied;
  };

  const onAfterResize = (plane) => {
    setResolution(plane);
  };

  return (
    <Plane
      className="SimpleVideoPlane"
      // plane init parameters
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      widthSegments={20}
      heightSegments={20}
      uniforms={uniforms}
      // plane events
      onReady={onReady}
      onRender={onRender}
      onAfterResize={onAfterResize}
    >
      <video
        src={Video}
        poster="/hero-homepage-30-large.jpg"
        autoPlay
        loop
        data-sampler="simplePlaneTexture"
      />
    </Plane>
  );
}