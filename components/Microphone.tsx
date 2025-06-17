import React from "react";
import styles from "../styles/Microphone.module.sass";
import MicrophoneSvgIcon from './Icons/MicrophoneSvgIcon.tsx';
import StopSvgIcon from './Icons/StopSvgIcon.tsx';

interface MicrophoneProps {
    isListening: boolean;
    onStart: () => void;
    onStop: () => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ isListening, onStart, onStop }) => {
    return (
        !isListening ? (
            <div className={styles["microphone-wrapper"]} onClick={onStart}>
                <MicrophoneSvgIcon className={`${styles["mic-icon"]} icon white stroke-color without-margin`} />
                <span className={styles.wave + " " + styles.static}></span>
            </div>
        ) : (
            <div className={styles["microphone-wrapper"]} onClick={onStop}>
                <StopSvgIcon className={`${styles["stop-icon"]} icon red without-margin`} />
                <span className={styles.wave + " " + styles.static}></span>
                <span className={styles.wave + " " + styles.wave1}></span>
                <span className={styles.wave + " " + styles.wave2}></span>
                <span className={styles.wave + " " + styles.wave3}></span>
            </div>
        )
    );
};

export default Microphone;