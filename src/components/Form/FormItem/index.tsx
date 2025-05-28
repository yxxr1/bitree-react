import React, { useState, useRef } from "react";

interface FormProps {
    onSubmit: (value: number) => void;
    buttonTitle: string;
}

const intRegexp = /^[0-9]*$/;

export const FormItem: React.FC<FormProps> = ({ onSubmit, buttonTitle }) => {
    const [value, setValue] = useState<string | undefined>("");
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div>
            <input ref={ref} value={value} onChange={e => intRegexp.test(e.target.value) && setValue(e.target.value)} />
            <button onClick={() => {
                if (value) {
                    onSubmit(+value);
                    setValue("");
                    ref.current && (ref.current.value = "");
                }
            }}>{buttonTitle}</button>
        </div>
    );
}