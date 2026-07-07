import {X} from "lucide-react";

const Modal = ({isOpen, onClose, children, title}) => {
    if (!isOpen)
        return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-black/60 backdrop-blur-sm">
            <div className="relative p-4 w-full max-w-2xl max-h-[90vh]">
                <div className="relative bg-slate-900 rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700">
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-700 rounded-t-xl">
                        <h3 className="text-xl font-semibold text-slate-50">
                            {title}
                        </h3>

                        <button
                            onClick={onClose}
                            type="button"
                            className="text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-slate-50 rounded-lg text-sm w-9 h-9 flex items-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <X className="w-9 h-4" />
                        </button>
                    </div>

                    <div className="p-5 md:p-6 text-slate-200">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;
