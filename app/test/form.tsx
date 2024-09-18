'use client'
import { useRef } from "react";
import { insert } from './actions'
import Swal from 'sweetalert2'

export default function Form() {
    const ref = useRef<HTMLFormElement>(null);

    Swal.fire({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool'
    })

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
