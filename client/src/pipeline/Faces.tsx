"use client";

import * as faceapi from "face-api.js";

export async function loadModels() {
  const MODEL_URL = "/models"; // Path to your face-api.js models
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

export async function detectFaces(
  input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
) {
  return await faceapi.detectAllFaces(
    input,
    new faceapi.SsdMobilenetv1Options()
  );
}

export async function getDescriptors(
  image: HTMLImageElement | HTMLCanvasElement
) {
  return await faceapi
    .detectAllFaces(image, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks()
    .withFaceDescriptors();
}

export async function getDescriptor(
  image: HTMLImageElement | HTMLCanvasElement
) {
  return await faceapi
    .detectSingleFace(image, new faceapi.SsdMobilenetv1Options())
    .withFaceLandmarks()
    .withFaceDescriptor();
}

export async function compareDescriptors(
  descriptor1: number[] | Float32Array,
  descriptor2: number[] | Float32Array
) {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}
