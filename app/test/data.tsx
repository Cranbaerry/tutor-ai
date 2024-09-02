'use server'
import { fetch } from './actions'

export default async function Data() {

    const data = await fetch();

    return (
        <ul>
        {
            data.data?.map((value) => {
                return (
                    <li key={value.id}>{value.id}. {value.name}</li>
                )
            })
        }
        </ul>
    )
}
