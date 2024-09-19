import Data from './data'
import Form from './form'

export default function TestPage() {

    // Test to use both client component and server component at the same time
    return (
        <div>
            <Form />
            <br />
            <p>Record:</p>

            <Data />

        </div>
    )
}