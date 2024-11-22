import { useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { AudioListener, AudioLoader } from "three";

const Sound = ({ url }) => {
  const sound = useRef(null);
  const { camera } = useThree();
  const [listener] = useState(() => new AudioListener());
  const buffer = useLoader(AudioLoader, url);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (sound.current) {
      sound.current.setBuffer(buffer);
      sound.current.setRefDistance(0.2);
      sound.current.setLoop(true);
    }

    camera.add(listener);

    return () => {
      camera.remove(listener);
      if (sound.current?.isPlaying) {
        sound.current.stop();
      }
    };
  }, [camera, buffer, listener]);

  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!isInitialized.current && sound.current) {
        const context = sound.current.context;

        if (context.state === "suspended") {
          await context.resume();
        }

        sound.current.play();
        isInitialized.current = true;

        // Remove the event listener after initializing
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      }
    };

    // Attach event listeners to capture the first user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [buffer]);

  return <positionalAudio ref={sound} args={[listener]} />;
};

export default Sound;
