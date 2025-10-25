import React, { ReactNode, useEffect } from 'react'
import {
    Modal as RNModal,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler,
    Platform,
} from 'react-native'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (Platform.OS === 'android') {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                () => {
                    onClose()
                    return true
                }
            )
            return () => backHandler.remove()
        }
    }, [onClose])

    return (
        <RNModal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1 justify-center items-center"
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableWithoutFeedback>
                    <View className="rounded-lg p-4 min-w-[300px] relative border mx-[5rem]">
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </RNModal>
    )
}

export default Modal
