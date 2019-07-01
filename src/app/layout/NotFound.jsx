import React from 'react'
import { Button } from 'semantic-ui-react'

const NotFount = ({history}) => {
    return (
        <div>
            <h1>Error 404 </h1>
            <Button onClick={() =>history.push('/events')} content='Back Home' color='teal'></Button>
        </div>
    )
}

export default NotFount;
