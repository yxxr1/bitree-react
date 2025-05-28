import React from "react";
import { FormItem } from "./FormItem";

interface FormProps {
    onAdd: (value: number) => void;
    onDelete: (value: number) => void;
    onFind: (value: number) => void;
    onRandomGen: () => void;
    onRebuildClick: () => void;
}

export const Form: React.FC<FormProps> = ({ onAdd, onDelete, onFind, onRandomGen, onRebuildClick }) => {
    return (
        <div>
            <button onClick={onRandomGen}>Random</button>
            <button onClick={onRebuildClick}>Rebuild</button>
            <FormItem buttonTitle="Add" onSubmit={onAdd} />
            <FormItem buttonTitle="Delete" onSubmit={onDelete} />
            <FormItem buttonTitle="Find" onSubmit={onFind} />
        </div>
    );
}