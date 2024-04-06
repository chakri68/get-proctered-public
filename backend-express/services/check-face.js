// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import tf from "@tensorflow/tfjs-node";

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from "canvas";

import * as faceapi from "face-api.js";
import { ROOT_DIR } from "../utils/env.js";

const { Canvas, Image, ImageData } = canvas;
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

/**
 * @param {Buffer} imageBuffer
 */
export function createImageElementFromBuffer(imageBuffer) {
  const img = new canvas.Image();
  img.onerror = (err) => {
    throw err;
  };
  img.src = imageBuffer;
  return img;
}

/**
 * @param {Buffer} input
 */
export async function getFaceDescriptors(input) {
  const image = createImageElementFromBuffer(input);
  const result = await faceapi
    // @ts-ignore
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) {
    throw new Error("No face detected");
  }

  return result.descriptor;
}

/**
 * @param {Parameters<faceapi["euclideanDistance"]>["0"]} descriptor1
 * @param {Parameters<faceapi["euclideanDistance"]>["1"]} descriptor2
 */
export async function compareDescriptors(descriptor1, descriptor2) {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}

export async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(`${ROOT_DIR}/models`);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(`${ROOT_DIR}/models`);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(`${ROOT_DIR}/models`);
}

/**
 * @param {Buffer} face
 * @param {Float32Array} descriptor
 * @returns {Promise<boolean>} True if the face matches the descriptors
 */
export async function compareFaceToDescriptor(face, descriptor) {
  const newDescriptors = await getFaceDescriptors(face);
  const faceDiff = await compareDescriptors(descriptor, newDescriptors);

  return faceDiff < 0.5;
}
