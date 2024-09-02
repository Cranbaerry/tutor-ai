'use client'
import { useRef } from "react";
import { insert } from './actions'

export default function Form() {
    const ref = useRef<HTMLFormElement>(null);

    return (
        <form ref={ref} action={async (formData) => {
            await insert(formData);
            ref.current?.reset();
        }}>
            <label htmlFor="name">Name: </label>
            <input id="name" name="name" type="text" required />
            <button>Insert</button>
        </form>
    )
}
