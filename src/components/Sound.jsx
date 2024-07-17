import { useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { AudioListener, AudioLoader } from "three";

const Sound = ({ url, isPlaying }) => {
  const sound = useRef(null);
  const { camera } = useThree();
  const [listener] = useState(() => new AudioListener());
  const buffer = useLoader(AudioLoader, url);

  useEffect(() => {
    if (sound.current) {
      sound.current.setBuffer(buffer);
      sound.current.setRefDistance(0.5);
      sound.current.setLoop(true);
    }
    camera.add(listener);
    return () => camera.remove(listener);
  }, [camera, buffer, listener]);

  useEffect(() => {
    if (sound.current && sound.current.context.state !== "running") {
      sound.current.context.resume();
    }
    if (isPlaying) {
      if (!sound.current.isPlaying) {
        sound.current.play();
      }
    } else {
      if (sound.current.isPlaying) {
        sound.current.pause();
      }
    }
  }, [isPlaying]);

  return <positionalAudio ref={sound} args={[listener]} />;
};

export default Sound;
