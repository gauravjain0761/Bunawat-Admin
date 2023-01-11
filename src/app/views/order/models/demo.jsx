import React from 'react'
import Pdf from "react-to-pdf";

const Demo = () => {
    const ref = React.createRef();
    return (
        <div>
            <Pdf targetRef={ref} filename="code-example.pdf">
                {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
            </Pdf>
            <div ref={ref} >
                <h1>Hello CodeSandbox</h1>
                <div style={{ display: 'none' }}>
                    <h2>Start editing to see some magic happen!</h2>
                </div>
            </div>
        </div>
    )
}

export default Demo