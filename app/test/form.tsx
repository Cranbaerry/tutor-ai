'use client'
import { useRef } from "react";
import { insert } from './actions'
import Swal from 'sweetalert2'
import {logout} from '../logout/actions'

async function tryLogout() {
    let a = await logout()
}

export default function Form() {
    const ref = useRef<HTMLFormElement>(null);

    // Swal.fire({
    //     title: 'Error!',
    //     text: 'Do you want to continue',
    //     icon: 'error',
    //     confirmButtonText: 'Cool'
    // })

    return (
        <div className="">
            <form ref={ref} action={async (formData) => {
                await insert(formData);
                ref.current?.reset();
            }}>

                <label htmlFor="name">Name: </label>
                <input id="name" name="name" type="text" required />
                <button>Insert</button>
            </form>

            <button onClick={tryLogout}>Logout</button>
        </div>
    )
}
