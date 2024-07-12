import {
  cameraIdle,
  cameraLookAtConst,
  cameraLookAtDefault,
} from "../constances/constances";
import { useCameraControl } from "../contexts/CameraControlContext";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useModalControl } from "../contexts/ModalControlContext";
import Modal from "./UI/Modal";
import WelcomeMessage from "./UI/WelcomeMessage";

const Interface = () => {
  const { animation, setAnimation, setPosition, setRotation } =
    useCharacterAnimations();
  const { setCameraLookAt } = useCameraControl();

  const { modalIsOpen, setModalIsOpen } = useModalControl();

  return (
    <div>
      <button
        className="absolute bottom-4 left-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-2xl px-6"
        onClick={() => {
          if (animation === "idle") {
            setAnimation("typing");
            setCameraLookAt(cameraLookAtConst);
            setPosition([0, 0, 0]);
            setRotation([0, 0, 0]);
          } else {
            setAnimation("idle");
            setCameraLookAt(cameraIdle);
          }
        }}
      >
        {animation === "typing" ? "stand" : "sit"}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onSend={() => setModalIsOpen(false)}
      />
      <WelcomeMessage />
    </div>
  );
};

export default Interface;
