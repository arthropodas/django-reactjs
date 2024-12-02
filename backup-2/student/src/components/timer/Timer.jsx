import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import ConfirmDialog from "../alert/DialogConfirmation";

function Timer({ initialHour, initialMinutes, initialSeconds, onTimeOut, setTime }) {
    const [hour, setHour] = useState(initialHour);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);
    const [openModal, setOpenModal] = useState(false);
    const [timerColor, setTimerColor] = useState("black");
    const navigate = useNavigate();

    const handleOpenModal = () => {
        if (onTimeOut) {
            onTimeOut();
        }
        setOpenModal(true);
    }

    useEffect(() => {
        setHour(initialHour);
        setMinutes(initialMinutes);
        setSeconds(initialSeconds);
    }, [initialHour, initialMinutes, initialSeconds]);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                if (minutes === 0) {
                    if (hour === 0) {
                        clearInterval(timerId);
                        handleOpenModal();
                    } else {
                        setHour(hour - 1);
                        setMinutes(59);
                        setSeconds(59);
                    }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }

            // Update time in Zustand store
            setTime(hour, minutes, seconds);

            if (hour === 0 && minutes < 1) {
                setTimerColor("red");
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [hour, minutes, seconds]);

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    return (
        <>
            <Text fontSize="4xl" ml={1} color={timerColor}>
               {formatTime(hour)}:{formatTime(minutes)}:{formatTime(seconds)}
            </Text>
            <ConfirmDialog
                open={openModal}
                title="Time's Up!"
                description="Your exam time has expired. The response has been submitted automatically. If you have any questions or need assistance, contact support."
                onConfirm={() => navigate("/thanks")}
                okBoolean={true}
            />
        </>
    );
}

export default Timer
