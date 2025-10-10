const Modal = ({ children, onClose }: { children?: React.ReactNode, onClose?: () => void }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center" onClick={onClose}/>
            <div className="fixed bg-white inset-0 m-auto rounded-lg shadow-lg w-[50vw] h-[50vh] max-w-md p-5">
                {children}
            </div>
        </>
    );
}

export default Modal;