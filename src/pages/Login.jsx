import React from 'react'
import { Container, Login as LoginComponent } from '../components'

function Login() {
    return (
        <Container>
            <div className='py-8'>
                <LoginComponent />
            </div>
        </Container>
    )
}

export default Login