import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";

const Input = ({label, value, onchange, placeholder, type, isSelect, options}) => {

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-200 block mb-1">
                {label}
            </label>
            <div className="relative">
                {isSelect ? (
                    <select
                        value={value}
                        onChange={(e) => onchange(e)}
                        className="w-full bg-slate-950/60 outline-none border border-slate-700 rounded-md py-2 px-3 text-slate-100 placeholder:text-slate-500 leading-tight focus:outline-none focus:border-teal-400">
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        className="w-full bg-slate-950/60 outline-none border border-slate-700 rounded-md py-2 px-3 pr-10 text-slate-100 placeholder:text-slate-500 leading-tight focus:outline-none focus:border-teal-400"
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onchange(e)}/>
                )}

                {type === 'password' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                                size={20}
                                className="text-teal-300"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                className="text-slate-500"
                                onClick={toggleShowPassword}
                            />
                            )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;
